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
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
      ],
      backgroundColor: ['#FF6384']
    },
    {
      label: 'Madhapur',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
      ],
      backgroundColor: ['#36A2EB']
    },
    {
      label: 'Miyapur',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
      ],
      backgroundColor: ['#FFCE56']
    },
    {
      label: 'KPHB',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
      ],
      backgroundColor: ['#4BC0C0']
    },
    {
      label: 'JNTU',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
      ],
      backgroundColor: ['#9966FF']
    },
    {
      label: 'Jubilee Hills',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
      ],
      backgroundColor: ['#FF9F40']
    },
    {
      label: 'Abids',
      data: [
        { x: 'Air Quality', y: 19 },
        { x: 'Water Quality', y: 7 },
        { x: 'Water Quantity', y: 17 },
        { x: 'Crowd Monitoring', y: 10 },
        { x: 'Weather Monitoring', y: 19 },
        { x: 'Energy Monitoring', y: 15 }
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

    const options = {
      plugins: {
        title: {
          display: true,
          text: `Verticals in Region ${data.label}`
        }
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div className="bar-chart">
        <Bar data={chartData} options={options} />
        <h5>Bar Chart for {data.label}</h5>
      </div>
    );
  }
}

export default BarChart;
