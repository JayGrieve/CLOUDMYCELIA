import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CurrentGrow from './CurrentGrow';
import CardList from './CardList';
import StrainAnalysis from './StrainAnalysis';

function TopTabs() {
  const tabSpacing = 20;
  const topSpacing = 5; // Variable to control spacing on top of the tab bar
  const fontSize = '25px'; // Variable to control font size (can be 'sm', 'md', 'lg', 'xl', or a specific size like '20px')

  return (
    <Tabs align="center" mt={topSpacing}>
      <TabList
        display="flex"
        justifyContent="center"
        borderBottom="None"
      >
        <Tab
          _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'white' }}
          _hover={{color: 'blue.300', borderBottom: '2px solid', borderColor: 'blue.300' }}
          mx={tabSpacing} // Adds spacing between tabs
          px={tabSpacing} // Adds padding within each tab
          fontSize={fontSize} // Sets the font size
        >
          Current Grow
        </Tab>
        <Tab
          _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'white' }}
          _hover={{color: 'blue.300', borderBottom: '2px solid', borderColor: 'blue.300' }}
          mx={tabSpacing}
          px={tabSpacing}
          fontSize={fontSize} // Sets the font size
        >
          Past Grows
        </Tab>
        <Tab
          _selected={{ color: 'white', borderBottom: '2px solid', borderColor: 'white' }}
          _hover={{color: 'blue.300', borderBottom: '2px solid', borderColor: 'blue.300' }}
          mx={tabSpacing}
          px={tabSpacing}
          fontSize={fontSize} // Sets the font size
        >
          Strain Analysis
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CurrentGrow></CurrentGrow>
        </TabPanel>
        <TabPanel>
          <CardList></CardList>
        </TabPanel>
        <TabPanel>
          <StrainAnalysis></StrainAnalysis>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default TopTabs;
