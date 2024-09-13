import React, { useContext, useState } from "react";
import {
  Box,
  VStack,
  Flex,
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
} from "@chakra-ui/react";
import CardItem from "./CardItem"; // Adjust the path as needed
import PastGrow from "./PastGrow";  // Import PastGrow component
import { JsonContext } from "./JsonContext";  // Import the context

// Function to calculate the colonization time (days between start_date and end_date, inclusive)
const calculateColonizationTime = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate || new Date());
  if (endDate === "Active"){
    return null;
  }
  const differenceInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return differenceInDays;
};

// Function to compare colonization times chronologically
const getColonizationComparison = (currentSession, sortedSessions, index) => {
  const species = currentSession.jar_info?.jar_1?.species || "Unknown Species";
  const currentColonizationTime = calculateColonizationTime(
    currentSession.start_date,
    currentSession.end_date
  );

  // Find the most recent previous grow of the same species in sorted chronological order
  const previousSession = sortedSessions
    .slice(0, index) // Only consider previous sessions
    .filter((session) => session.jar_info?.jar_1?.species === species)
    .pop(); // Get the most recent one before the current session

  if (previousSession) {
    const previousColonizationTime = calculateColonizationTime(
      previousSession.start_date,
      previousSession.end_date
    );
    const improvement = currentColonizationTime < previousColonizationTime;
    return { improvement, previousColonizationTime };
  }

  return { improvement: null, previousColonizationTime: null }; // Return null if no previous session exists
};

const CardList = ({
  cardWidth = "90%",
  cardHeight = "auto",
  cardSpacing = 4,
  topSpacing = 4,
}) => {
  const { jsonData, loading, error } = useContext(JsonContext);  // Access JSON data from context
  const [selectedSession, setSelectedSession] = useState(null); // Change state to store the selected session

  // Handle loading or error states
  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error loading data</Box>;

  // Access grow sessions data from JSON and sort them by `start_date` in reverse chronological order
  const growSessions = (jsonData?.grow_sessions?.sessions || []).sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA; // Sort in descending order by start_date
  });

  const handleViewGrow = (session) => {
    setSelectedSession(session);  // Set the selected session when "View Grow" is clicked
  };

  const handleBack = () => {
    setSelectedSession(null);  // Reset the selected session to null to go back
  };

  if (selectedSession) {
    // Pass the selected session data to PastGrow
    return <PastGrow onBack={handleBack} pastSession={selectedSession} />;  
  }

  return (
    <VStack spacing={cardSpacing} p={topSpacing} alignItems="flex-start">
      {growSessions.map((session, index) => {
        const colonizationTime = calculateColonizationTime(
          session.start_date,
          session.end_date
        );

        // Compare the current session with past sessions of the same species in chronological order
        const { improvement, previousColonizationTime } = getColonizationComparison(
          session,
          growSessions,
          index
        );

        const card = {
          id: index + 1,  // Generate a unique id for each card
          title: `Grow ${index + 1}`,
          dateRange: `${session.start_date} / ${session.end_date}`,
          colonizationTime,  // Use the calculated colonization time
          sporeSource: session.jar_info?.jar_1?.source || "Unknown Source",
          species: session.jar_info?.jar_1?.species || "Unknown Species",
          strain: session.jar_info?.jar_1?.strain || "Unknown Strain",
        };

        return (
          <Flex key={card.id} width="100%" alignItems="center">
            {/* Stepper with custom Step and Separator */}
            <Stepper orientation="vertical" height="100%" alignItems="center">
              <Step>
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  position="relative"
                >
                  <Flex alignItems="center" justifyContent="center">
                    <StepIndicator mt={-5}>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber>{index + 1}</StepNumber>}
                        active={<StepNumber>{index + 1}</StepNumber>}
                      />
                    </StepIndicator>
                    <Box ml={2} textAlign="center" mt={-5}>
                      <Text fontWeight="bold">
                        {card.dateRange.split(" / ")[0]}
                      </Text>
                      <Text fontWeight="bold">-</Text>
                      <Text fontWeight="bold">{card.dateRange.split(" / ")[1]}</Text>
                    </Box>
                  </Flex>
                  {index < growSessions.length - 1 && (
                    <Box
                      border="5px dashed black"
                      borderColor="gray.300"
                      borderWidth={1}
                      width="2px"
                      height="50px"
                      position="absolute"
                      bottom="-65px"
                      left="50%"
                      transform="translateX(850%)"
                    />
                  )}
                </Flex>
              </Step>
            </Stepper>

            {/* Card item */}
            <Box ml={8} flex="1">
              <CardItem
                title={card.title}
                dateRange={card.dateRange}
                colonizationTime={card.colonizationTime}
                sporeSource={card.sporeSource}
                species={card.species}
                strain={card.strain}
                width={cardWidth}
                height={cardHeight}
                mb={cardSpacing}
                // Pass improvement and previous colonization time to CardItem
                improvement={improvement} 
                previousColonizationTime={previousColonizationTime}
                onViewGrow={() => handleViewGrow(session)}  // Pass the session for view grow
              />
            </Box>
          </Flex>
        );
      })}
    </VStack>
  );
};

export default CardList;
