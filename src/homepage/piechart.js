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
  };

  const options = {
    cutout: 0,
    plugins: {
      title: {
        display: true,
        text: 'Regions'
      }
    },
    responsive: true
  };

  return (
    <div className="pie-chart-container">
      <Pie ref={chartRef} data={segmentData} options={options} onClick={handleSegmentClick} />
    </div>
  );
}

export default PieChart;
