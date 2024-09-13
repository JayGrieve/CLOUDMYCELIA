import React from 'react';
import { Progress, Box } from '@chakra-ui/react';

const ProgressBar = ({ percent }) => {
  return (
    <Box width="100px">
      <Progress value={percent} />
    </Box>
  );
};

export default ProgressBar;
