import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  IconButton,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import jarImage from '../assets/images/jar_white.png'; // Adjust the path as needed
import JarInfoCard from './JarInfoCard';
import ButtonGroupPast from './ButtonGroupPast'; // Updated import

function PastGrow({ onBack, pastSession }) {
  // Variables for sizing and styling
  const imageSize = '250px'; // Variable for image size
  const progressBarWidth = '90px'; // Variable for progress bar width
  const progressBarHeight = '70%'; // Variable for progress bar height
  const outlineThickness = '7px'; // Outline thickness
  const borderRadius = '10px'; // Border radius for rounded rectangle
  const progressBarTopBuffer = '50px'; // Buffer space to move progress bar down from the top of the image
  const topSpacing = '30px'; // Variable to control spacing from the top of the page

  const [selectedJars, setSelectedJars] = useState([]); // Track selected jars

  if (!pastSession) {
    return (
      <Box mt={topSpacing} textAlign="center">
        <Text fontSize="xl" fontWeight="bold">No past session available.</Text>
      </Box>
    );
  }

  // Get the most recent progress data from the colonization_progress object
  const progressData = pastSession?.colonization_progress;
  const mostRecentDate = progressData ? Object.keys(progressData).sort().pop() : null;
  const recentProgress = mostRecentDate ? progressData[mostRecentDate] : {};

  if (!recentProgress || Object.keys(recentProgress).length === 0) {
    return (
      <Box mt={topSpacing} textAlign="center">
        <Text fontSize="xl" fontWeight="bold">No colonization progress data available.</Text>
      </Box>
    );
  }

  // Handle jar selection
  const handleJarClick = (key) => {
    setSelectedJars((prevSelectedJars) =>
      prevSelectedJars.includes(key)
        ? prevSelectedJars.filter((jar) => jar !== key) // Deselect jar
        : [...prevSelectedJars, key] // Select jar
    );
  };

  return (
    <Box mt={topSpacing}>
      <Flex mb={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go back"
          onClick={onBack}  // Trigger the onBack function passed via props
        />
      </Flex>
      <SimpleGrid columns={4} spacing={8} justifyItems="center">
        {Object.keys(recentProgress).map((key, index) => {
          const percent = recentProgress[key];
          const displayPercent = Math.round(percent * 100);
          const isSelected = selectedJars.includes(key);

          return (
            <Box
              key={index}
              position="relative"
              textAlign="center"
              onClick={() => handleJarClick(key)} // Handle jar selection on click
              cursor="pointer"
              border={isSelected ? '5px solid #90cdf4' : 'none'} // Light blue outline when selected
              borderRadius="10px"
              margin={isSelected ? '0px' : '0px'} // Add a bit more margin around the selected card
              padding={isSelected ? '0px' : '0px'} // Add more space when selected
              transition="all 0.2s ease-in-out" // Smooth transition
              _hover={{
                border: '5px solid #90cdf4', // Light blue on hover
                borderRadius: '15px',
                margin: '5px',
                padding: '5px',
              }}
            >
              <Box
                position="relative"
                width={imageSize}
                height={imageSize}
                backgroundImage={`url(${jarImage})`}
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                backgroundPosition="center"
                mx="auto"
              >
                <Box
                  position="absolute"
                  left="50%"
                  top={progressBarTopBuffer}
                  transform="translateX(-50%)"
                  width={progressBarWidth}
                  height={progressBarHeight}
                  border={`${outlineThickness} solid white`}
                  borderRadius={borderRadius}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  background="transparent"
                >
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="flex-end"
                    justifyContent="center"
                  >
                    <Box
                      width="100%"
                      height={`${displayPercent}%`}
                      backgroundColor="white"
                    />
                    <Text
                      position="absolute"
                      color={displayPercent < 70 ? 'white' : '#121212'}
                      fontWeight="bold"
                      fontSize="30px"
                      top={
                        displayPercent < 70
                          ? `calc(${100 - displayPercent}% - 40px)`
                          : `calc(${100 - displayPercent}% + -4px)`
                      }
                      left="50%"
                      transform="translateX(-50%)"
                    >
                      {`${displayPercent}%`}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <JarInfoCard jarData={pastSession.jar_info[key]} imageSize={imageSize} />
            </Box>
          );
        })}
      </SimpleGrid>
      <ButtonGroupPast pastSession={pastSession} selectedJars={selectedJars} /> {/* Pass selected jars */}
    </Box>
  );
}

export default PastGrow;
