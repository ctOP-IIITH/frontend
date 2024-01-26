import React from 'react';
import { Bar } from 'react-chartjs-2';
import './barchart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ selectedSegment }) {
  console.log('selectedSegment:', selectedSegment);

  const segmentData = [
    {
      label: 'Gachibowli',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#FF6384']
    },
    {
      label: 'Madhapur',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#36A2EB']
    },
    {
      label: 'Miyapur',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#FFCE56']
    },
    {
      label: 'KPHB',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#4BC0C0']
    },
    {
      label: 'JNTU',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#9966FF']
    },
    {
      label: 'Jubilee Hills',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#FF9F40']
    },
    {
      label: 'Abids',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crwod Monitoring', y: 10 }
      ],
      backgroundColor: ['#C9CBCF']
    }
  ];

  console.log('selectedSegment:', selectedSegment);
  if (selectedSegment >= 0 && selectedSegment < segmentData.length) {
    const data = segmentData[selectedSegment];

    const xLabels = data.data.map((item) => item.x);
    const yValues = data.data.map((item) => item.y);

    const chartData = {
      labels: xLabels, // X-axis labels
      datasets: [
        {
          label: data.label,
          data: yValues, // Y-axis data
          backgroundColor: data.backgroundColor
        }
      ]
    };

    return (
      <div>
        <h2>Bar Chart for {data.label}</h2>
        <Bar data={chartData} />
      </div>
    );
  }
}

export default BarChart;
