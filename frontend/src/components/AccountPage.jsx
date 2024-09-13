import React from 'react';
import {
  Box,
  Heading,
  IconButton,
  Text,
  VStack,
  Button,
  Flex,
  Divider,
  HStack,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  // Dummy data for the account
  const accountData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    accountVersion: 'Demo',
  };

  // Handle back button
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // Use responsive breakpoint for better layout on mobile and desktop
  const cardWidth = useBreakpointValue({ base: '90%', md: '500px' });

  return (
    <Box bg="#121212" minHeight="100vh" p={8} color="white">
      {/* Back Arrow */}
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        onClick={handleBackClick} // Navigate back on click
        size="lg"
        variant="ghost"
        colorScheme="teal"
        mb={6}
      />

      {/* Main content */}
      <Flex justifyContent="center" alignItems="center">
        <Box
          bg="gray.800"
          borderRadius="md"
          p={8}
          width={cardWidth}
          boxShadow="lg"
        >
          {/* Heading */}
          <Heading as="h2" size="lg" textAlign="center" mb={6}>
            Account Details
          </Heading>

          <VStack spacing={4} align="start">
            {/* Account Info */}
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" width="100%">
              <Text fontWeight="bold">First Name:</Text>
              <Text>{accountData.firstName}</Text>
            </Stack>
            <Divider borderColor="gray.600" />
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" width="100%">
              <Text fontWeight="bold">Last Name:</Text>
              <Text>{accountData.lastName}</Text>
            </Stack>
            <Divider borderColor="gray.600" />
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" width="100%">
              <Text fontWeight="bold">Email:</Text>
              <Text>{accountData.email}</Text>
            </Stack>
            <Divider borderColor="gray.600" />
            <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" width="100%">
              <Text fontWeight="bold">Account Version:</Text>
              <Text>{accountData.accountVersion}</Text>
            </Stack>
          </VStack>

          {/* Buttons for Update Info and Delete Account */}
          <HStack mt={8} justifyContent="space-between">
            <Button
              colorScheme="teal"
              width="48%"
              onClick={() => alert('Feature disabled for demo.')}
            >
              Update Info
            </Button>
            <Button
              colorScheme="red"
              width="48%"
              onClick={() => alert('Feature disabled for demo.')}
            >
              Delete Account
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default AccountPage;
