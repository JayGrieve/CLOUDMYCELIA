import {
  Box,
  Text,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Button,
  Flex,
} from "@chakra-ui/react";

const CardItem = ({
  title,
  colonizationTime,
  sporeSource,
  species,
  strain,
  width,
  height,
  mb,
  improvement, // Accept improvement prop
  previousColonizationTime, // Accept previous colonization time prop
  onViewGrow, // Accept onViewGrow prop
}) => {
  // Determine the label for colonization improvement
  const improvementLabel =
    improvement === null
      ? "Baseline" // First grow for this species
      : improvement
      ? "Improvement"
      : "Slower";

  console.log(colonizationTime)
  const daysString = 
    colonizationTime === null
        ? "Incomplete Grow"
        : colonizationTime + " days";


  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={mb}
      width={width}
      height={height}
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
    >
      <Flex height="100%" align="center">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          flex="1"
        >
          {title}
        </Text>
        <Divider orientation="vertical" borderColor="gray.300" height="40px" mx={4} />
        <Stat textAlign="center" flex="1">
          <Text
            fontSize="lg"
            fontWeight="medium"
            textDecoration="underline"
            mb={1}
          >
            Colonization Time
          </Text>
          <StatNumber fontSize="md">{daysString}</StatNumber>
          <StatHelpText fontSize="sm">
            {improvement === null ? (
              improvementLabel
            ) : (
              <>
                <StatArrow type={improvement ? "increase" : "decrease"} />
                {improvementLabel}
              </>
            )}
            
          </StatHelpText>
        </Stat>
        <Divider orientation="vertical" borderColor="gray.300" height="40px" mx={4} />
        <Box textAlign="center" flex="1">
          <Text fontSize="lg" fontWeight="medium" textDecoration="underline" mb={1}>
            Spore Source
          </Text>
          <Text fontSize="md">{sporeSource}</Text>
        </Box>
        <Divider orientation="vertical" borderColor="gray.300" height="40px" mx={4} />
        <Box textAlign="center" flex="1">
          <Text fontSize="lg" fontWeight="medium" textDecoration="underline" mb={1}>
            Species
          </Text>
          <Text fontSize="md">{species}</Text>
        </Box>
        <Divider orientation="vertical" borderColor="gray.300" height="40px" mx={4} />
        <Box textAlign="center" flex="1">
          <Text fontSize="lg" fontWeight="medium" textDecoration="underline" mb={1}>
            Strain
          </Text>
          <Text fontSize="md">{strain}</Text>
        </Box>
        <Divider orientation="vertical" borderColor="gray.300" height="40px" mx={4} />
        <Flex justify="center" align="center" flex="1">
          <Button fontSize="lg" colorScheme="teal" size="md" onClick={onViewGrow}>
            View Grow
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CardItem;
