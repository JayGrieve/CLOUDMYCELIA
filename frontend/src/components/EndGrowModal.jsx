import React, { useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';
import { JsonContext } from './JsonContext'; // Import the JsonContext

function EndCurrentGrowModal({ isOpen, onClose, onConfirm }) {
  const { jsonData, updateJson } = useContext(JsonContext); // Access JSON data and update function from context

  // Check if there is an active grow session
  const currentGrow = jsonData?.grow_sessions?.sessions.some((session) => session.active === 'Y');

  const handleConfirm = () => {
    if (jsonData && currentGrow) {
      // Find the active session
      const updatedSessions = jsonData.grow_sessions.sessions.map((session) => {
        if (session.active === 'Y') {
          // Get the last date from colonization_progress
          const lastDate = Object.keys(session.colonization_progress).sort().pop();
          return { ...session, active: 'N', end_date: lastDate }; // Set session as inactive and set end_date
        }
        return session;
      });

      // Update the JSON data with the updated sessions
      const updatedJsonData = {
        ...jsonData,
        grow_sessions: {
          ...jsonData.grow_sessions,
          sessions: updatedSessions,
        },
      };

      // Use updateJson to upload the changes
      updateJson(updatedJsonData);

      // Trigger any additional logic passed as props
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Grow Session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {currentGrow
              ? 'Are you sure you want to end this grow session?'
              : 'There is no active grow session.'}
          </Text>
        </ModalBody>
        <ModalFooter>
          {currentGrow && (
            <Button colorScheme="red" onClick={() => alert('Feature disabled for demo.')} mr={3}>{/*handleConfirm} mr={3}>*/}
              Yes
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            {currentGrow ? 'No' : 'Close'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EndCurrentGrowModal;
