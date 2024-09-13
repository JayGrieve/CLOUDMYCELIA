import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import ReportModalPast from './ReportModalPast';

function ButtonGroupPast({ pastSession, selectedJars }) {
  return (
    <Box mt="30px" textAlign="center">
      {/* Top button triggers ReportModalPast */}
      <Box mb="20px">
        <ReportModalPast
          growSession={pastSession}  // Pass the session data to ReportModalPast
          selectedJars={selectedJars} // Pass selected jars from PastGrow
          triggerButton={
            <Button
              width="260px"
              height="40px"
              colorScheme="whiteAlpha"
              variant="solid"
            >
              View Report ({selectedJars.length}) {/* Display count of selected jars */}
            </Button>
          }
        />
      </Box>
    </Box>
  );
}

export default ButtonGroupPast;
