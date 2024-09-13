import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { JsonContext } from './JsonContext'; // Import JsonContext

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StrainAnalysis = () => {
  const { jsonData, loading, error } = useContext(JsonContext); // Access data from JsonContext
  const [xAxisCategory, setXAxisCategory] = useState('Species');
  const [sortOrder, setSortOrder] = useState('asc'); // asc for ascending, desc for descending

  // Handle loading or error states
  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error loading data</Box>;

  // Function to calculate the colonization time (days between start_date and end_date, inclusive)
  const calculateColonizationTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1; // Inclusive calculation
  };

  // Aggregating data based on the selected category (Species, Strain, Session)
  const aggregateData = () => {
    const grows = jsonData?.grow_sessions?.sessions || [];

    // Filter sessions that have completed = 'Y'
    const completedGrows = grows.filter((grow) => grow.completed === 'Y');

    const aggregatedData = completedGrows.reduce((acc, grow) => {
      const colonizationTime = calculateColonizationTime(grow.start_date, grow.end_date);

      let key;
      if (xAxisCategory === 'Species') {
        key = grow.jar_info?.jar_1?.species || 'Unknown Species';
      } else if (xAxisCategory === 'Strain') {
        key = grow.jar_info?.jar_1?.strain || 'Unknown Strain';
      } else if (xAxisCategory === 'Session') {
        key = `Session ${grows.indexOf(grow) + 1}`;
      }

      // Aggregate colonization time by key (species, strain, or session)
      if (!acc[key]) {
        acc[key] = { totalDays: 0, count: 0 };
      }
      acc[key].totalDays += colonizationTime;
      acc[key].count += 1;

      return acc;
    }, {});

    // Calculate average colonization time for each key
    return Object.entries(aggregatedData).map(([label, { totalDays, count }]) => ({
      label,
      days: totalDays / count, // Average colonization time
    }));
  };

  const aggregatedData = aggregateData();

  const sortedData = [...aggregatedData].sort((a, b) => {
    return sortOrder === 'asc' ? a.days - b.days : b.days - a.days;
  });

  const graphData = {
    labels: sortedData.map((item) => item.label),
    datasets: [
      {
        label: 'Colonization Time (days)',
        data: sortedData.map((item) => item.days),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: `Colonization Time by ${xAxisCategory}`,
        color: 'white',
        font: {
          size: 36,
          weight: 'bold',
        },
        padding: {
          bottom: 30,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Colonization Time (days)',
          color: 'white',
          font: {
            size: 24,
          },
        },
        ticks: {
          color: 'white',
          font: {
            size: 18,
          },
        },
      },
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 18,
          },
        },
      },
    },
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <VStack spacing={8} p={6} bg="#121212" borderRadius="md" boxShadow="lg">
      <HStack spacing={6} justifyContent="center" mb={6}>
        <ButtonGroup variant="solid" size="lg">
          <Button
            onClick={() => setXAxisCategory('Species')}
            colorScheme={xAxisCategory === 'Species' ? 'teal' : 'gray'}
          >
            Species
          </Button>
          <Button
            onClick={() => setXAxisCategory('Strain')}
            colorScheme={xAxisCategory === 'Strain' ? 'teal' : 'gray'}
          >
            Strain
          </Button>
          <Button
            onClick={() => setXAxisCategory('Session')}
            colorScheme={xAxisCategory === 'Session' ? 'teal' : 'gray'}
          >
            Session
          </Button>
        </ButtonGroup>
        <IconButton
          aria-label="Sort by Colonization Time"
          icon={sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          onClick={toggleSortOrder}
          colorScheme="teal"
          size="lg"
        />
      </HStack>
      <Box w="100%" h="500px">
        <Bar data={graphData} options={options} />
      </Box>
    </VStack>
  );
};

export default StrainAnalysis;
