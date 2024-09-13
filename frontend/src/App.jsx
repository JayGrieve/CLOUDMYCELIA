import React from 'react';
import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/color-mode';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

// Import your components
import RootLayout from './layouts/RootLayout';
import IntroPage from './components/IntroPage';
import TopTabs from './components/TopTabs';
import AccountPage from './components/AccountPage'; // Import AccountPage

// Import JsonContext provider
import { JsonProvider } from './components/JsonContext';

// Configure Chakra UI theme
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

// Define your routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<IntroPage />} />
      <Route path="demo" element={<TopTabs />} />
      <Route path="account" element={<AccountPage />} /> {/* Add AccountPage route */}
    </Route>
  )
);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <JsonProvider>
        <RouterProvider router={router}> {/* Ensure everything is inside RouterProvider */}
          <Box bg="#121212" minHeight="100vh" color="white" position="relative">
            {/* The routing and menu are both inside the RouterProvider */}
            {/* The RootLayout will handle the layout and include the SettingsMenu */}
          </Box>
        </RouterProvider>
      </JsonProvider>
    </ChakraProvider>
  );
}

export default App;
