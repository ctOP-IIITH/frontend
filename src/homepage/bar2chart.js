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
        data: [45, 60, 70, 50],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bar2-chart">
      <Bar data={data} />
      <h4>-------REGION-------</h4>
    </div>
  );
}

export default Bar2Chart;
