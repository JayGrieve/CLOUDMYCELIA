import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import MultiLineChart from './MultiLineChart';
import CustomCheckboxPast from './CustomCheckboxPast';

function ReportModalPast({ triggerButton, growSession, selectedJars }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get progress data for jars from the passed growSession
  const progressData = growSession?.colonization_progress || {};

  // Get jar options (e.g., 'jar_1', 'jar_2', etc.) from the keys of the first date's progress (since each date should have the same jars)
  const options = Object.keys(progressData[Object.keys(progressData)[0]] || {});

  // Initialize an array of booleans for selection state, using the pre-selected jars
  const [selectionState, setSelectionState] = useState(selectedJars);

  // Set selection state based on the selected jars from PastGrow when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectionState(selectedJars);
    }
  }, [selectedJars, isOpen]);

  const handleSelectChange = (jar) => {
    setSelectionState((prevSelection) =>
      prevSelection.includes(jar)
        ? prevSelection.filter((selectedJar) => selectedJar !== jar) // Deselect jar
        : [...prevSelection, jar] // Select jar
    );
  };

  return (
    <>
      <Box onClick={onOpen}>{triggerButton}</Box>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Colonization Report for {growSession?.start_date} - {growSession?.end_date || 'Ongoing'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="flex-start">
            {/* Multi-select list on the left side */}
            <Box width="30%" borderRight="1px solid #E2E8F0" pr={4}>
              <Stack direction="column">
                {options.map((option, index) => (
                  <CustomCheckboxPast
                    key={index}
                    value={option}
                    isChecked={selectionState.includes(option)}
                    onChange={handleSelectChange}
                  >
                    {/* Display human-readable jar name, but keep the original key intact */}
                    {option.replace('jar_', 'Jar ')}
                  </CustomCheckboxPast>
                ))}
              </Stack>
            </Box>

            {/* Graph component on the right side */}
            <Box width="70%" pl={4}>
              <MultiLineChart selectedJars={selectionState} progressData={progressData} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ReportModalPast;
