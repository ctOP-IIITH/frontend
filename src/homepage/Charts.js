// import React, { useState } from 'react';

// // import { Bar } from 'react-chartjs-2';
// import PieChart from './PieChart';
// import BarChart from './BarChart';
// import './Charts.css';

// const initialData = {
//   labels: ['Gachibowli', 'Madhapur', 'KPHB', 'JNTU', 'Jubilee', 'Koti'],
//   datasets: [
//     {
//       label: 'Number of Sensors',
//       data: [4, 2, 6, 7, 5, 3],
//       backgroundColor: [
//         'rgba(255,99,132,0.6)',
//         'rgba(54,162,235,0.6)',
//         'rgba(255,206,86,0.6)',
//         'rgba(75,192,192,0.6)',
//         'rgba(153,102,255,0.6)',
//         'rgba(255,159,64,0.6)'
//       ],
//       borderWidth: 1
//     }
//   ]
// };

// function Charts() {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [barData, setBarData] = useState({});

//   const handlePieChartClick = (event, elements) => {
//     if (!elements || elements.length === 0) return;

//     const { index } = elements[0]; // Destructuring to get the index of the clicked element
//     setActiveIndex(index); // Setting the active index

//     const newBarData = {
//       labels: [initialData.labels[index]], // Getting the label for the clicked segment
//       datasets: [
//         {
//           label: 'Number of Sensors',
//           data: [initialData.datasets[0].data[index]], // Getting the data for the clicked segment
//           backgroundColor: initialData.datasets[0].backgroundColor[index], // Getting the color for the clicked segment
//           borderWidth: 1
//         }
//       ]
//     };

//     setBarData(newBarData); // Updating the barData state
//   };

//   return (
//     <div className="charts-container">
//       <div className="pie-chart-container">
//         <h2>Location</h2>
//         <PieChart data={initialData} onClick={handlePieChartClick} />
//       </div>
//       <div className="bar-chart-container">
//         <h2>Number of Sensors</h2>
//         {activeIndex !== null && <BarChart data={barData} />}
//         {/* Conditional rendering to show the Bar chart only when a pie segment is clicked */}
//         {/* {activeIndex !== null && <Bar data={barData} />} */}
//       </div>
//     </div>
//   );
// }
// export default Charts;
