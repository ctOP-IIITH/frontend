import React, { useRef } from 'react';
import { Pie, getElementAtEvent } from 'react-chartjs-2';
import './piechart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, PieController);

function PieChart({ onSegmentClick }) {
  const chartRef = useRef();

  const data = [
    {
      label: 'Gachibowli',
      data: 300,
      backgroundColor: ['#FF6384']
    },
    {
      label: 'Madhapur',
      data: 50,
      backgroundColor: ['#36A2EB']
    },
    {
      label: 'Miyapur',
      data: 100,
      backgroundColor: ['#FFCE56']
    },
    {
      label: 'KPHB',
      data: 80,
      backgroundColor: ['#4BC0C0']
    },
    {
      label: 'JNTU',
      data: 60,
      backgroundColor: ['#9966FF']
    },
    {
      label: 'Jubilee Hills',
      data: 70,
      backgroundColor: ['#FF9F40']
    },
    {
      label: 'Abids',
      data: 45,
      backgroundColor: ['#C9CBCF']
    }
  ];

  const segmentData = {
    labels: data.map((segment) => segment.label),
    datasets: [
      {
        label: 'Piechart',
        data: data.map((segment) => segment.data),
        backgroundColor: data.map((segment) => segment.backgroundColor[0])
      }
    ]
  };

  const handleSegmentClick = (e) => {
    const { index } = getElementAtEvent(chartRef.current, e)[0];
    console.log('Clicked segment index:', index);
    onSegmentClick(index);
    // console.log('Clicked segment index:', index);
    // console.log('Segment data length:', segmentData.length);

    // if (index >= 0 && index < segmentData.length) {
    //   const selectedSegment = segmentData[index];

    //   // Check if selectedSegment has the 'data' property
    //   if (selectedSegment && Array.isArray(selectedSegment.data)) {
    //     // Access the 'data' property and perform the necessary operations
    //     const segmentDataArray = selectedSegment.data;

    //     // Check if segmentDataArray has a valid length before using it
    //     if (segmentDataArray.length > 0) {
    //       // Handle the data as needed
    //     } else {
    //       console.error("Selected segment's data array is empty.");
    //     }
    //   } else {
    //     console.error("Selected segment is missing 'data' property or 'data' is not an array.");
    //   }
    // } else {
    //   console.error('Invalid segment index.');
    // }
  };

  const options = {
    cutout: 0
  };

  return (
    <div className="pie-chart-container">
      <Pie ref={chartRef} data={segmentData} options={options} onClick={handleSegmentClick} />
    </div>
  );
}

export default PieChart;
