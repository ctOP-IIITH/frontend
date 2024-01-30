import React, { useRef } from 'react';
import { Pie, getElementAtEvent } from 'react-chartjs-2';
import './piechart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, PieController);

function PieChart({ onSegmentClick }) {
  const chartRef = useRef();

  const labels = [
    'Air Quality',
    'Water Quality',
    'Water Quantity',
    'Waste Management',
    'Energy Monitoring'
  ];
  const backgroundColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF'
  ];

  const data = labels.map((label, index) => ({
    label,
    data: 1,
    backgroundColor: [backgroundColors[index]]
  }));

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
    let index;
    const elements = getElementAtEvent(chartRef.current, e);

    if (elements.length > 0) {
      index = elements[0].index;
      onSegmentClick(index);
      console.log('Clicked segment index:', index);
    }
  };

  const options = {
    cutout: 0,
    plugins: {
      title: {
        display: true,
        text: 'Verticals'
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
