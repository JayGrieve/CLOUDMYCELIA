import React from 'react';
import { Box, Flex, Center } from '@chakra-ui/react';
import ImageWithProgressBar from './ImageWithProgressBar';

const ImageRow = ({ imageWidth, imageHeight, percents }) => {
  const marginSpace = 20;
  return (
    <Box p={4} border="1px solid #ccc" borderRadius="lg" boxShadow="md">
      <Center>
        <Flex justify="space-between">
          <Box marginRight={marginSpace}>
            <ImageWithProgressBar imageWidth={imageWidth} imageHeight={imageHeight} percent={percents[0]}  title="Jar 1" />
          </Box>
          <Box marginRight={marginSpace}>
            <ImageWithProgressBar imageWidth={imageWidth} imageHeight={imageHeight} percent={percents[1]}   title="Jar 2"/>
          </Box>
          <Box marginRight={marginSpace}>
            <ImageWithProgressBar imageWidth={imageWidth} imageHeight={imageHeight} percent={percents[2]}   title="Jar 3"/>
          </Box>
          <Box marginRight={marginSpace}>
            <ImageWithProgressBar imageWidth={imageWidth} imageHeight={imageHeight} percent={percents[3]}   title="Jar 4"/>
          </Box>
        </Flex>
      </Center>
    </Box>
  );
};

export default ImageRow;
