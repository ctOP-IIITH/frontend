import React from 'react';
import { Bar } from 'react-chartjs-2';
import './bar3chart.css';
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

function Bar3Chart() {
  const data = {
    labels: ['Gachibowli', 'Madhapur', 'Miyapur', 'KPHB', 'JNTU', 'Jubilee Hills', 'Abids'],
    datasets: [
      {
        label: 'Working Nodes',
        data: [15, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#00cc00',
        borderColor: '#006400',
        borderWidth: 1
      },
      {
        label: 'Not Working Nodes',
        data: [3, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#ff0000',
        borderColor: '#b30000',
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Nodes in an Area'
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  };

  return (
    <div className="bar3-chart">
      <Bar data={data} options={options} />
      <h5>AREA</h5>
    </div>
  );
}

export default Bar3Chart;
