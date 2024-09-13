import React from 'react';
import { Box, Flex, Center } from '@chakra-ui/react';
import LineGraph from './LineGraph';
import ProgressBar from './ProgressBar';
import ImageWithProgressBar from './ImageWithProgressBar';
import ImageRow from './ImageRow';

const GraphBox = () => {
  const xValues = ['3/1/15', '3/1/16', '3/1/17', '3/1/18', '3/1/19', '3/1/20', '3/1/21'];
  const yValues1 = [65, 59, 80, 81, 56, 55, 40];
  const yValues2 = [23,44,45,53,53,42,52];
  const yValues3 = [42, 44, 44, 43, 45, 50, 51];


  return (
    <Box p={4} border="1px solid #ccc" borderRadius="lg">
      <Center mb={8}>
        <Box p={4} borderRadius="md" boxShadow="md" backgroundColor="white">
          <Flex justify="space-between">
            <LineGraph xValues={xValues} yValues={yValues1} title={'Temperature'}/>
            <LineGraph xValues={xValues} yValues={yValues2} title={'Humidity'}/>
            <LineGraph xValues={xValues} yValues={yValues3} title={'CO2'}/>
          </Flex>
        </Box>
      </Center>
      <Center>
        <ImageRow percents={[50, 24, 35, 80]} imageWidth={200} imageHeight={200}/>
      </Center>
    </Box>
  );
};

export default GraphBox;
