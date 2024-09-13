import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import date-fns adapter
import { Text, Center } from "@chakra-ui/react"

const LineGraph = ({ xValues, yValues , title, label}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let myChart = null;

    const data = {
      labels: xValues,
      datasets: [
        {
          label: label,
          data: yValues,
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 2,
        },
      ],
    };

    const chartConfig = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false, // Hide legend
          },
        },
      },
    };

    if (chartRef.current) {
      if (myChart) {
        myChart.destroy();
      }
      myChart = new Chart(chartRef.current, chartConfig);
    }

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [xValues, yValues]);

  return (
    <div>
        <Center>
            <Text fontSize="md">
                {title}
            </Text>
        </Center>
        <canvas ref={chartRef} style={{ maxWidth: '600px', maxHeight: '400px' }} />
    </div>
  );
};

export default LineGraph;