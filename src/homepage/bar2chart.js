import React from 'react';
import { Bar } from 'react-chartjs-2';
import './bar2chart.css';
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

function Bar2Chart() {
  const data = {
    labels: ['Gachibowli', 'Madhapur', 'Miyapur', 'KPHB', 'JNTU', 'Jubilee Hills', 'Abids'],
    datasets: [
      {
        label: 'Verticals',
        data: [45, 60, 70, 50, 20, 30, 40],
        backgroundColor: '#ffa500',
        borderColor: '#ff2500',
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Working of Nodes in a Region'
      },
      legend: {
        display: true,
        position: 'top'
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
    <div className="bar2-chart">
      <Bar data={data} options={options} />
      <h5>REGION</h5>
    </div>
  );
}

export default Bar2Chart;
