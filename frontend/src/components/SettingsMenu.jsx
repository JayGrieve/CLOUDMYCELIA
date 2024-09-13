import React from 'react';
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Flex,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SettingsMenu = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const menuItemStyles = {
    position: 'relative',
    color: 'black',
    _hover: {
      color: 'blue.500',
      _after: {
        transform: 'scaleX(1)',
      },
    },
    _after: {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '2px',
      backgroundColor: 'blue.500',
      bottom: '0',
      left: '0',
      transform: 'scaleX(0)',
      transformOrigin: 'center',
      transition: 'transform 0.2s ease-in-out',
    },
  };

  const menuItemStylesLogout = {
    position: 'relative',
    color: 'black',
    _hover: {
      color: 'red.500',
      _after: {
        transform: 'scaleX(1)',
      },
    },
    _after: {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '2px',
      backgroundColor: 'red.500',
      bottom: '0',
      left: '0',
      transform: 'scaleX(0)',
      transformOrigin: 'center',
      transition: 'transform 0.2s ease-in-out',
    },
  };

  // Function to handle the Account button click and navigate to /account
  const handleAccountClick = () => {
    navigate('/account'); // Navigate to the Account page
  };

  return (
    <Flex
      justifyContent="flex-end"
      p={4}
      position="fixed"
      top={0}
      right={0}
      zIndex="1000"  // Ensure this is on top of other elements
    >
      <Popover trigger="hover" placement="bottom-end">
        <PopoverTrigger>
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon w={8} h={8} />}  // Use the SettingsIcon
            variant="ghost"  // Ensure a clean, transparent background for the button
            color="white"  // White color to make it visible against a dark background
            _hover={{ bg: 'gray.700' }}  // Provide a hover effect for better UX
          />
        </PopoverTrigger>
        <PopoverContent bg="white" border="none" boxShadow="md">
          <PopoverBody p={0}>
            <Box
              as="button"
              {...menuItemStyles}
              w="100%"
              p={2}
              textAlign="left"
              onClick={handleAccountClick} // Add onClick to navigate to the Account page
            >
              Account
            </Box>
            <Box as="button" {...menuItemStylesLogout} w="100%" p={2} textAlign="left" onClick={()=>alert("Feature disabled for demo")}>
              Log Out
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export default SettingsMenu;
