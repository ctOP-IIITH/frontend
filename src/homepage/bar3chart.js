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
        label: 'Nodes',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(155, 69, 192,0.2)',
        borderColor: 'rgba(155, 69, 192,1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bar-chart">
      <Bar data={data} />
      <h4>-------REGIONS-------</h4>
    </div>
  );
}

export default Bar3Chart;
