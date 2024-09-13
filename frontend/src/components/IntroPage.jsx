import React from 'react';
import { Box, Button, Text, VStack, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const IntroPage = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/demo'); // Navigate to TopTabs component
  };

  return (
    <Center height="100vh" bg="gray.800" color="white">
      <VStack spacing={8} alignItems="center">
        {/* Title */}
        <Box textAlign="center">
          <Text fontSize="5xl" fontWeight="bold">
            CLOUDMYCELIA Demo
          </Text>
        </Box>

        {/* Enter Button */}
        <Button
          colorScheme="teal"
          size="lg"
          borderRadius="md"
          px={8}
          py={6}
          onClick={handleEnter}
        >
          ENTER SITE
        </Button>

        {/* Disclaimer */}
        <Text fontSize="md" color="gray.400" textAlign="center" maxW="400px">
          This is a demo version, certain features will be disabled.
        </Text>
      </VStack>
    </Center>
  );
};

export default IntroPage;
