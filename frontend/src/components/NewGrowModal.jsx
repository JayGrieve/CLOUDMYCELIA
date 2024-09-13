import React, { useState, useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Box,
  VStack,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
} from '@chakra-ui/react';
import { JsonContext } from './JsonContext'; // Import JsonContext

const steps = ['Jar 1', 'Jar 2', 'Jar 3', 'Jar 4'];

function NewGrowForm({ isOpen, onClose }) {
  const [sameInfo, setSameInfo] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const { jsonData, updateJson } = useContext(JsonContext); // Access JSON context

  // Form data state
  const [formData, setFormData] = useState({
    sporeSource: '',
    species: '',
    strain: '',
    mlInjected: '',
    jarInfo: {
      jar_1: { sporeSource: '', species: '', strain: '', mlInjected: '' },
      jar_2: { sporeSource: '', species: '', strain: '', mlInjected: '' },
      jar_3: { sporeSource: '', species: '', strain: '', mlInjected: '' },
      jar_4: { sporeSource: '', species: '', strain: '', mlInjected: '' },
    },
  });

  const handleInputChange = (e, jar) => {
    const { name, value } = e.target;

    if (sameInfo) {
      // If same info for all jars, set the same info for all jars
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        jarInfo: {
          jar_1: { ...prevData.jarInfo.jar_1, [name]: value },
          jar_2: { ...prevData.jarInfo.jar_2, [name]: value },
          jar_3: { ...prevData.jarInfo.jar_3, [name]: value },
          jar_4: { ...prevData.jarInfo.jar_4, [name]: value },
        },
      }));
    } else {
      // If info differs by jar, set it for the specific jar
      setFormData((prevData) => ({
        ...prevData,
        jarInfo: {
          ...prevData.jarInfo,
          [jar]: {
            ...prevData.jarInfo[jar],
            [name]: value,
          },
        },
      }));
    }
  };

  const handleNextJar = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handlePreviousJar = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSaveGrow = () => {
    const today = new Date().toISOString().split('T')[0]; // Today's date as start date

    const newGrowSession = {
      active: 'Y',
      start_date: today,
      end_date: null,
      jar_info: {
        jar_1: {
          source: formData.jarInfo.jar_1.sporeSource,
          species: formData.jarInfo.jar_1.species,
          strain: formData.jarInfo.jar_1.strain,
        },
        jar_2: {
          source: formData.jarInfo.jar_2.sporeSource,
          species: formData.jarInfo.jar_2.species,
          strain: formData.jarInfo.jar_2.strain,
        },
        jar_3: {
          source: formData.jarInfo.jar_3.sporeSource,
          species: formData.jarInfo.jar_3.species,
          strain: formData.jarInfo.jar_3.strain,
        },
        jar_4: {
          source: formData.jarInfo.jar_4.sporeSource,
          species: formData.jarInfo.jar_4.species,
          strain: formData.jarInfo.jar_4.strain,
        },
      },
      colonization_progress: {
        [today]: {
          jar_1: 0,
          jar_2: 0,
          jar_3: 0,
          jar_4: 0,
        },
      },
    };

    const updatedJsonData = {
      ...jsonData,
      grow_sessions: {
        sessions: [...jsonData.grow_sessions.sessions, newGrowSession],
      },
    };

    // Update the JSON in the context
    updateJson(updatedJsonData);

    // Close the modal
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="500px">
        <ModalHeader>New Grow Information</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            {/* Stepper Navigation */}
            {!sameInfo && (
              <Box width="100%" overflowX="auto">
                <Stepper size="lg" index={activeStep} orientation="horizontal" gap="0px">
                  {steps.map((step, index) => (
                    <Step key={index} flex="1">
                      <StepIndicator>
                        <StepStatus complete={<StepTitle>{step}</StepTitle>} />
                      </StepIndicator>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}

            <FormControl>
              <FormLabel>Spore Source</FormLabel>
              <Input
                name="sporeSource"
                placeholder="Enter Spore Source"
                value={sameInfo ? formData.sporeSource : formData.jarInfo[`jar_${activeStep + 1}`]?.sporeSource || ''}
                onChange={(e) => handleInputChange(e, `jar_${activeStep + 1}`)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Species</FormLabel>
              <Input
                name="species"
                placeholder="Enter Species"
                value={sameInfo ? formData.species : formData.jarInfo[`jar_${activeStep + 1}`]?.species || ''}
                onChange={(e) => handleInputChange(e, `jar_${activeStep + 1}`)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Strain # (optional)</FormLabel>
              <Input
                name="strain"
                placeholder="Enter Strain #"
                value={sameInfo ? formData.strain : formData.jarInfo[`jar_${activeStep + 1}`]?.strain || ''}
                onChange={(e) => handleInputChange(e, `jar_${activeStep + 1}`)}
              />
            </FormControl>

            <Checkbox isChecked={sameInfo} onChange={() => setSameInfo(!sameInfo)}>
              Same info for all Jars
            </Checkbox>

            {!sameInfo && (
              <Box mt={4} textAlign="center" width="100%">
                <Button onClick={handlePreviousJar} mr={2} isDisabled={activeStep === 0}>
                  Previous
                </Button>
                <Button onClick={handleNextJar} ml={2} isDisabled={activeStep === steps.length - 1}>
                  Next
                </Button>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSaveGrow}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewGrowForm;
