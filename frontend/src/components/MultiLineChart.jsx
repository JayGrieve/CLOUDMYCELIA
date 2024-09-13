import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MultiLineChart({ selectedJars, progressData }) {
  // Log progressData to inspect its structure
  console.log('Progress Data:', progressData);

  // Extract the available dates from the progressData
  const dates = Object.keys(progressData).sort();

  // Log extracted dates to ensure they're in the expected format
  console.log('Dates:', dates);

  // Prepare datasets dynamically based on selected jars
  const allDatasets = {
    'jar_1': {
      label: 'Jar 1',
      data: dates.map(date => (progressData[date]?.jar_1 || 0) * 100), // Convert to percentage, default to 0 if undefined
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      tension: 0.4, // Smooth the lines
    },
    'jar_2': {
      label: 'Jar 2',
      data: dates.map(date => (progressData[date]?.jar_2 || 0) * 100),
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
      tension: 0.4,
    },
    'jar_3': {
      label: 'Jar 3',
      data: dates.map(date => (progressData[date]?.jar_3 || 0) * 100),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.4,
    },
    'jar_4': {
      label: 'Jar 4',
      data: dates.map(date => (progressData[date]?.jar_4 || 0) * 100),
      borderColor: 'rgba(153, 102, 255, 1)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      fill: false,
      tension: 0.4,
    },
  };

  // Filter selected jars to ensure they match the keys in allDatasets
  const validSelectedJars = selectedJars.filter(jar => allDatasets[jar]);

  // Log selected jars and valid datasets to ensure they're correct
  console.log('Selected Jars:', selectedJars);
  console.log('Valid Selected Jars:', validSelectedJars);

  const chartData = validSelectedJars.length > 0
    ? {
        labels: dates,
        datasets: validSelectedJars.map(jar => allDatasets[jar]), // Ensure only valid datasets are passed
      }
    : { labels: [], datasets: [] }; // Provide empty data if no jars are selected

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Jar Colonization Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Scan Date',
        },
      },
      y: {
        title: {
          display: true,
          text: '% Colonized',
        },
        reverse: false, // Ensure the latest date is at the bottom
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default MultiLineChart;
