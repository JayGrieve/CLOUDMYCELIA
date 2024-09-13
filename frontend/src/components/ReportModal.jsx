import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  useDisclosure,
  Divider,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons'; // Import InfoOutlineIcon from @chakra-ui/icons
import MultiLineChart from './MultiLineChart';
import CustomCheckbox from './CustomCheckbox';
import { JsonContext } from './JsonContext'; // Import JsonContext

// Calculate Estimated Time Remaining
function calculateEstTimeRemaining(currentProgress, pastSessions, currentDaysIntoSession) {
  let totalDaysToCompletion = 0;
  let matchingSessionsCount = 0;
  let comparableGrowTime = null;

  pastSessions.forEach((session) => {
    const pastProgress = session.colonization_progress;
    const pastEndDate = new Date(session.end_date);
    const pastStartDate = new Date(session.start_date);

    let closestDate;
    let closestProgressDiff = Infinity;

    Object.entries(pastProgress).forEach(([date, jars]) => {
      const progress = jars.jar_1; // Using jar_1 for simplicity
      if (progress < 1) { // Filter out jars with 100% progress
        const progressDiff = Math.abs(progress - currentProgress);
        if (progressDiff < closestProgressDiff) {
          closestProgressDiff = progressDiff;
          closestDate = new Date(date);
        }
      }
    });

    if (closestDate && !isNaN(closestDate.getTime())) {
      const daysToCompletion = Math.floor((pastEndDate - closestDate) / (1000 * 60 * 60 * 24));
      const totalPastDays = Math.floor((pastEndDate - pastStartDate) / (1000 * 60 * 60 * 24));
      comparableGrowTime = totalPastDays; // Store the total elapsed time of the comparable grow
      totalDaysToCompletion += daysToCompletion;
      matchingSessionsCount++;
    }
  });

  if (matchingSessionsCount === 0) return { estTimeRemaining: "N/A", arrowType: null };

  const averageDaysToCompletion = totalDaysToCompletion / matchingSessionsCount;
  const totalEstimatedDays = Math.round(currentDaysIntoSession + averageDaysToCompletion);

  const arrowType =
    comparableGrowTime !== null && totalEstimatedDays > comparableGrowTime ? 'increase' : 'decrease';

  return { estTimeRemaining: Math.round(averageDaysToCompletion), arrowType };
}

function calculateRelativeVigor(currentDaysSinceStart, currentProgress, pastSessions) {
  let totalVigor = 0;
  let matchingJarsCount = 0;

  // Iterate over each past session
  pastSessions.forEach((session) => {
    const pastProgress = session.colonization_progress;
    const pastStartDate = new Date(session.start_date);

    let closestProgress = null;
    let closestDaysDiff = Infinity;

    // Iterate over each date in the past session
    Object.entries(pastProgress).forEach(([date, jars]) => {
      const pastDaysSinceStart = Math.floor((new Date(date) - pastStartDate) / (1000 * 60 * 60 * 24)); // Calculate how many days into the session this date is
      const daysDiff = Math.abs(pastDaysSinceStart - currentDaysSinceStart); // Compare with the current session's days

      // Find the closest date to the current session's timestamp
      if (daysDiff < closestDaysDiff) {
        closestDaysDiff = daysDiff;
        closestProgress = jars.jar_1; // Using jar_1 for simplicity, this should be generalized for each jar
      }
    });

    // Calculate relative vigor for this past session if progress is found
    if (closestProgress && closestProgress > 0 && currentProgress > 0) {
      totalVigor += currentProgress / closestProgress; // Add the vigor calculation
      matchingJarsCount++;
    }
  });

  // If no matches were found or progress is 0, return "N/A"
  if (matchingJarsCount === 0 || currentProgress === 0) return "N/A";

  // Calculate the average relative vigor across all selected jars
  return (totalVigor / matchingJarsCount).toFixed(2);
}

function ReportModal({ triggerButton, initialSelectedJars = [], onSelectionChange }) {
  const { jsonData, loading, error } = useContext(JsonContext); // Access data from context
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Find the active grow session
  const activeSession = jsonData?.grow_sessions?.sessions.find(
    (session) => session.active === 'Y'
  );
  
  // Get species from the active session (assuming all jars have the same species)
  const species = activeSession?.jar_info?.jar_1?.species || "Unknown Species";

  const pastSessions = jsonData?.grow_sessions?.sessions.filter(
    (session) => session.active !== 'Y' && session.completed === 'Y'
  ) || [];

  // Get progress data for jars (all dates, not just the most recent one)
  const progressData = activeSession?.colonization_progress || {};
  const currentDate = Object.keys(progressData).sort().pop(); // Get the most recent date
  const currentProgress = progressData[currentDate] || {};
  const options = Object.keys(currentProgress);

  // Local state for selected jars within the modal
  const [selectionState, setSelectionState] = useState([]);

  // Initialize selectionState only once when the modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectionState(initialSelectedJars.length > 0 ? initialSelectedJars : options);
    }
  }, [isOpen, initialSelectedJars, options]);

  // Toggle jar selection
  const handleSelectChange = (jar) => {
    const updatedSelection = selectionState.includes(jar)
      ? selectionState.filter((selectedJar) => selectedJar !== jar) // Deselect jar
      : [...selectionState, jar]; // Select jar

    setSelectionState(updatedSelection); // Update local state
    onSelectionChange(updatedSelection); // Notify parent component of the change
  };

  // Average the progress across selected jars
  const averageProgress = selectionState.length > 0
    ? selectionState.reduce((sum, jar) => sum + currentProgress[jar], 0) / selectionState.length
    : null;

  // Calculate average est. time remaining and relative vigor
  const daysSinceStart = Math.floor((new Date(currentDate) - new Date(activeSession?.start_date)) / (1000 * 60 * 60 * 24));

  const { estTimeRemaining, arrowType } = averageProgress !== null
    ? calculateEstTimeRemaining(averageProgress, pastSessions, daysSinceStart)
    : { estTimeRemaining: "N/A", arrowType: null };

  const relativeVigor = averageProgress !== null
    ? calculateRelativeVigor(daysSinceStart, averageProgress, pastSessions)
    : "N/A";

  // Determine the arrow direction for relative vigor
  const vigorArrowType = relativeVigor !== "N/A" && !isNaN(relativeVigor)
    ? (relativeVigor > 1 ? 'increase' : 'decrease')
    : null;

  // Tooltip content for Relative Vigor
  const vigorTooltip = relativeVigor >= 1
    ? `A relative vigor of ${relativeVigor} indicates these jars are colonizing ${Math.round((relativeVigor - 1) * 100,2)}% faster than previous grows of ${species}.`
    : `A relative vigor of ${relativeVigor} indicates these jars are colonizing ${Math.round((1 - relativeVigor) * 100,2)}% slower than previous grows of ${species}.`;

  return (
    <>
      <Box onClick={onOpen}>{triggerButton}</Box>

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Colonization Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="flex-start">
            {/* Multi-select list on the left side */}
            <Box width="30%" borderRight="1px solid #E2E8F0" pr={4}>
              <Stack direction="column">
                {options.map((option) => (
                  <CustomCheckbox
                    key={option}
                    value={option}
                    isChecked={selectionState.includes(option)}
                    onChange={() => handleSelectChange(option)}
                  >
                    {/* Display human-readable jar name, but keep the original key intact */}
                    {option.replace('jar_', 'Jar ')}
                  </CustomCheckbox>
                ))}
              </Stack>
            </Box>

            {/* Graph component on the right side */}
            <Box width="50%" pl={4}>
              <MultiLineChart selectedJars={selectionState} progressData={progressData} />
            </Box>

            {/* Divider and additional stats */}
            <Divider orientation="vertical" mx={4} />
            <Box width="25%" pl={4}>
              <Text fontWeight="bold" fontSize="lg" mb={2}>Additional Stats</Text>

              {/* Est. Time Remaining */}
              <Stat>
                <StatLabel>
                  Est. Time Remaining
                  <Tooltip label={`Estimated time remaining based on historical averages for ${species}`}>
                    <IconButton
                      aria-label="Info"
                      icon={<InfoOutlineIcon />}
                      variant="ghost"
                      size="xs"
                      ml={2}
                    />
                  </Tooltip>
                </StatLabel>
                <StatNumber>
                  {estTimeRemaining !== "N/A" ? `${estTimeRemaining} days` : "N/A"}
                  {arrowType && (
                    <StatArrow
                      type={arrowType}
                      color={arrowType === 'increase' ? 'red.500' : 'green.500'}
                      ml={2}
                    />
                  )}
                </StatNumber>
              </Stat>

              {/* Relative Vigor */}
              <Stat mt={4}>
                <StatLabel>
                  Relative Vigor
                  <Tooltip label={vigorTooltip}>
                    <IconButton
                      aria-label="Info"
                      icon={<InfoOutlineIcon />}
                      variant="ghost"
                      size="xs"
                      ml={2}
                    />
                  </Tooltip>
                </StatLabel>
                <StatNumber>
                  {relativeVigor !== "N/A" ? `${relativeVigor}x` : "N/A"}
                  {vigorArrowType && (
                    <StatArrow
                      type={vigorArrowType}
                      color={vigorArrowType === 'increase' ? 'green.500' : 'red.500'}
                      ml={2}
                    />
                  )}
                </StatNumber>
              </Stat>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ReportModal;

