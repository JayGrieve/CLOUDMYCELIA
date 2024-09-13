import React from 'react';
import { Box, useCheckbox } from '@chakra-ui/react';

function CustomCheckbox({ children, value, isChecked, onChange, ...props }) {
  const { getInputProps, getCheckboxProps, getLabelProps } = useCheckbox({
    ...props,
    isChecked, // Use isChecked value from parent
  });

  // Handle the change and pass the value to the parent component
  const handleChange = () => {
    onChange(value); // Pass the checkbox's value to the onChange handler in the parent
  };

  return (
    <Box as="label" display="block" mb={3}>
      {/* Attach the change handler directly to the input */}
      <input {...getInputProps()} hidden onChange={handleChange} />
      <Box
        {...getCheckboxProps()}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
        textAlign="center"
        transition="all 0.2s"
        aria-checked={isChecked}
      >
        <span {...getLabelProps()}>{children}</span>
      </Box>
    </Box>
  );
}

export default CustomCheckbox;
