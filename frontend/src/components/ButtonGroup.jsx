import React, { useContext, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import ReportModal from './ReportModal';
import NewGrowForm from './NewGrowModal';
import EndCurrentGrowModal from './EndCurrentGrowModal';
import EndGrowModal from './EndGrowModal';
import { JsonContext } from './JsonContext'; // Import JsonContext

function ButtonGroup({ selectedJars, setSelectedJars }) { // Receive props
  const { jsonData } = useContext(JsonContext); // Access JSON data from context

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isNewGrowModalOpen, setIsNewGrowModalOpen] = useState(false);
  const [isEndGrowModalOpen, setIsEndGrowModalOpen] = useState(false);

  // Check if there is a current active grow
  const currentGrow = jsonData?.grow_sessions?.sessions.some((session) => session.active === 'Y');

  const handleOpenModal = () => {
    if (currentGrow) {
      setIsEndModalOpen(true);
    } else {
      setIsNewGrowModalOpen(true);
    }
  };

  const handleCloseEndModal = () => {
    setIsEndModalOpen(false);
  };

  const handleConfirmEndGrow = () => {
    setIsEndModalOpen(false);
    setIsNewGrowModalOpen(true); // Open New Grow modal after confirming end grow
    setSelectedJars([]); // Reset selected jars when grow ends
  };

  const handleCloseNewGrowModal = () => {
    setIsNewGrowModalOpen(false);
  };

  const handleEndGrow = () => {
    setIsEndGrowModalOpen(true);
  };

  const handleCloseEndGrow = () => {
    setIsEndGrowModalOpen(false);
  };

  const handleConfirmEndGrowDefault = () => {
    setIsEndGrowModalOpen(false);
  };

  // Handler for updating selected jars from ReportModal
  const handleReportModalSelectionChange = (newSelectedJars) => {
    setSelectedJars(newSelectedJars);
  };

  return (
    <Box mt="30px" textAlign="center">
      {/* Top button triggers ReportModal */}
      <Box mb="20px">
        <ReportModal
          triggerButton={
            <Button
              width="260px"
              height="40px"
              colorScheme="whiteAlpha"
              variant="solid"
            >
              View Report {selectedJars.length > 0 && `(${selectedJars.length})`}
            </Button>
          }
          initialSelectedJars={selectedJars} // Pass selected jars as initial selection
          onSelectionChange={handleReportModalSelectionChange} // Handle selection change
        />
      </Box>

      {/* Centered bottom buttons */}
      <Box display="flex" justifyContent="center">
        <Box display="flex" justifyContent="space-between" width={currentGrow ? "calc(150px * 2 + 20px)" : "150px"}>
          {/* Show "End Current Grow" if a grow is active, otherwise show "New Grow" */}
          <Button
            width="150px"
            height="60px"
            colorScheme="green"
            variant="solid"
            onClick={handleOpenModal}
          >
            {'Start New Grow'}
          </Button>

          {/* Only show "End Grow" button if there is a current active grow */}
          {currentGrow && (
            <Button
              width="150px"
              height="60px"
              colorScheme="red"
              variant="outline"
              onClick={handleEndGrow}
            >
              End Grow
            </Button>
          )}
        </Box>
      </Box>

      {/* End Current Grow Modal */}
      <EndCurrentGrowModal
        isOpen={isEndModalOpen}
        onClose={handleCloseEndModal}
        onConfirm={handleConfirmEndGrow}
      />

      {/* End Grow Modal */}
      <EndGrowModal
        isOpen={isEndGrowModalOpen}
        onClose={handleCloseEndGrow}
        onConfirm={handleConfirmEndGrowDefault}
      />

      {/* New Grow Modal */}
      <NewGrowForm isOpen={isNewGrowModalOpen} onClose={handleCloseNewGrowModal} />
    </Box>
  );
}

export default ButtonGroup;
