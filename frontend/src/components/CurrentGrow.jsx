import React, { useContext, useState } from 'react';
import { Box, Text, SimpleGrid, Center, Button, useDisclosure } from '@chakra-ui/react';
import jarImage from '../assets/images/jar_white.png';
import JarInfoCard from './JarInfoCard';
import ButtonGroup from './ButtonGroup';
import { JsonContext } from './JsonContext';
import NewGrowForm from './NewGrowModal';

function CurrentGrow() {
  const { jsonData, loading, error } = useContext(JsonContext); // Access data from context
  const { isOpen, onOpen, onClose } = useDisclosure(); // Manage modal state with useDisclosure

  const [selectedJars, setSelectedJars] = useState([]); // State to track selected jars

  // If loading or error state, show corresponding messages
  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error loading data</Box>;

  // Find the active grow session
  const activeSession = jsonData?.grow_sessions?.sessions.find(
    (session) => session.active === 'Y'
  );

  // If no active grow session, show a message with "New Grow" button
  if (!activeSession) {
    return (
      <Center height="100vh" flexDirection="column">
        <Text fontSize="2xl" fontWeight="bold">
          There is no grow currently active.
        </Text>
        <Text fontSize="lg" mb={4}>
          Select "New Grow" to start one.
        </Text>
        <Button colorScheme="teal" size="lg" onClick={onOpen}>
          New Grow
        </Button>

        {/* New Grow Modal */}
        <NewGrowForm isOpen={isOpen} onClose={onClose} />
      </Center>
    );
  }

  // Get progress data for jars
  const progressData = activeSession?.colonization_progress || {};

  // Find the most recent date
  const mostRecentDate = Object.keys(progressData).sort().pop(); // Sort and get the last date

  // Get the progress for the most recent date
  const recentProgress = progressData[mostRecentDate] || {};

  const imageSize = '250px';
  const progressBarWidth = '90px';
  const progressBarHeight = '70%';
  const outlineThickness = '7px';
  const borderRadius = '10px';
  const progressBarTopBuffer = '50px';
  const topSpacing = '30px';

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
      <SimpleGrid columns={4} spacing={8} justifyItems="center">
        {Object.keys(recentProgress).map((key, index) => {
          const displayPercent = Math.round(recentProgress[key] * 100);
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
              transition="all 0.1s ease-in-out" // Smooth transition
              _hover={{
                border: '5px solid #90cdf4', // Light blue on hover
                //borderRadius: '10px',
                margin: '0px',
                padding: '3px',
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
                    <Box width="100%" height={`${displayPercent}%`} backgroundColor="white" />
                    <Text
                      position="absolute"
                      color={displayPercent < 70 ? 'white' : '#121212'}
                      fontWeight="bold"
                      fontSize="30px"
                      top={displayPercent < 70 ? `calc(${100 - displayPercent}% - 40px)` : `calc(${100 - displayPercent}% + -4px)`}
                      left="50%"
                      transform="translateX(-50%)"
                    >
                      {`${displayPercent}%`}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <JarInfoCard jarData={activeSession?.jar_info[key]} imageSize={imageSize} /> {/* Pass jar info */}
            </Box>
          );
        })}
      </SimpleGrid>
      <ButtonGroup selectedJars={selectedJars} setSelectedJars={setSelectedJars} /> {/* Pass setSelectedJars */}
    </Box>
  );
}

export default CurrentGrow;
