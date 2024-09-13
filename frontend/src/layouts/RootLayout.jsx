import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Heading } from '@chakra-ui/react';
import SettingsMenu from '../components/SettingsMenu'; // Import the SettingsMenu here

const RootLayout = () => {
  return (
    <Box bg="#121212" minHeight="100vh" color="white" position="relative">
      {/* Heading */}
      <Heading p={4}>CLOUDMYCELIA</Heading>

      {/* Settings Menu */}
      <SettingsMenu /> {/* Settings Menu is placed here */}

      {/* Outlet renders the child routes (IntroPage, TopTabs, AccountPage) */}
      <Outlet />
    </Box>
  );
};

export default RootLayout;
