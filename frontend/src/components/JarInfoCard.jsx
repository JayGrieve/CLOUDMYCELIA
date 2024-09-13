import React from 'react';
import { Box, Card, CardBody, Table, Tbody, Tr, Td, Button } from '@chakra-ui/react';

const JarInfoCard = ({ jarData, imageSize }) => {
  return (
    <Box textAlign="center">
      <Card mt={4} width={imageSize * 1.2}>
        <CardBody>
          <Table variant="simple">
            <Tbody>
              <Tr><Td width="25%">Source</Td><Td width="75%">{jarData?.source}</Td></Tr>
              <Tr><Td width="25%">Species</Td><Td width="75%">{jarData?.species}</Td></Tr>
              <Tr><Td width="25%">Strain</Td><Td width="75%">{jarData?.strain}</Td></Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};

export default JarInfoCard;
