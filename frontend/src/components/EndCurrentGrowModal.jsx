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

  const handleConfirm = () => {
    if (jsonData) {
      // Find the active session and set it to inactive
      const updatedSessions = jsonData.grow_sessions.sessions.map((session) => {
        if (session.active === 'Y') {
          return { ...session, active: 'N' }; // Set the current session to inactive
        }
        return session;
      });

      // Update the JSON data by marking all sessions inactive
      const updatedJsonData = {
        ...jsonData,
        grow_sessions: {
          ...jsonData.grow_sessions,
          sessions: updatedSessions,
        },
      };

      // Use updateJson to upload the changes
      updateJson(updatedJsonData);
    }

    onConfirm(); // Trigger any additional logic passed as props
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>End Current Grow Session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Starting a new grow session will end this grow session. Are you sure you want to do this?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={() => alert('Feature disabled for demo.')} mr={3}>{/*handleConfirm} mr={3}>*/}
            Yes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EndCurrentGrowModal;
