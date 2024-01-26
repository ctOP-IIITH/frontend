/* eslint-disable */

// import React from 'react';
// import Header from './header';
// import StatCard from './StatCard';
// import MainImage from './MainImage';
// // import Charts from './Charts';
// import DomainCard from './DomainCard'; // Import the DomainCard component
// // import { IoSwapVerticalSharp } from 'react-icons/io5';
// import PieChart from './piechart';
// import BarChart from './barchart';
// import Bar2Chart from './bar2chart';
// import Pie2Chart from './pie2chart';
// import './Home.css';

// const domainData = [
//   { icon: './domain.png', label: 'All Domains' },
//   { icon: './air-quality.jpg', label: 'Air Quality' },
//   { icon: './waterQuality.png', label: 'Water Quality' },
//   { icon: './water-quantity.png', label: 'Water Quantity' },
//   { icon: './crowd mon.png', label: 'Crowd Monitoring' }
// ];

// function Home() {
//   return (
//     <div className="home">
//       <Header />
//       {/* <div className="explore-button-container">
//         <button type="button" className="explore-button">
//           Explore datasets relevant to your region →
//         </button>
//       </div> */}
//       <div className="stats-container">
//         <StatCard number="37" label="Cities" />
//         <StatCard number="9" label="Domains" />
//         <StatCard number="48" label="Nodes" />
//         <StatCard number="167" label="SensorTypes" />
//       </div>
//       <MainImage />

//       {/* Domain cards section */}
//       <div className="domain-cards-container">
//         <h2>Discover by domains</h2>
//         <div className="domain-cards">
//           {domainData.map((domain) => (
//             <DomainCard key={domain.label} icon={domain.icon} label={domain.label} />
//           ))}
//         </div>
//         <div className="chart-container">
//         <PieChart />
//         <BarChart />
//       </div>
//       <div className="chart-container">
//         <Bar2Chart />
//         <Pie2Chart />
//         {/* <Charts /> */}
//       </div>
//     </div>
//   );
// }

// export default Home;

// import React from 'react';
import React, { useState } from 'react';
import { Typography, Container } from '@mui/material';
import Header from './header';
import StatCard from './StatCard';
import MainImage from './MainImage';
// import Charts from './Charts';
import DomainCard from './DomainCard';
// import { IoSwapVerticalSharp } from 'react-icons/io5';
import PieChart from './piechart';
import BarChart from './barchart';
import Bar2Chart from './bar2chart';
import Bar3Chart from './bar3chart';
// import Pie2Chart from './pie2chart';
import './Home.css';
import { Box } from '@mui/system';

const domainData = [
  { icon: './domain.png', label: 'All Domains' },
  { icon: './air-quality.jpg', label: 'Air Quality' },
  { icon: './waterQuality.png', label: 'Water Quality' },
  { icon: './water-quantity.png', label: 'Water Quantity' },
  { icon: './crowd mon.png', label: 'Crowd Monitoring' }
];

function Home() {
  const [selectedSegment, setSelectedSegment] = useState(0);

  const handleSegmentClick = (index) => {
    setSelectedSegment(index);
  };

  return (
    <Box className="home">
      <Container maxWidth="sm">
        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
          Hyderabad
        </Typography>
      </Container>
      <Header />
      {/* <div className="explore-button-container">
        <button type="button" className="explore-button">
          Explore datasets relevant to your region →
        </button>
      </div> */}
      <div className="stats-container">
        <StatCard number="37" label="Cities" />
        <StatCard number="9" label="Domains" />
        <StatCard number="48" label="Nodes" />
        <StatCard number="167" label="SensorTypes" />
      </div>
      <MainImage />
      {/* Domain cards section */}
      <div className="domain-cards-container">
        <h2>Discover by domains</h2>
        <div className="domain-cards">
          {domainData.map((domain) => (
            <DomainCard key={domain.label} icon={domain.icon} label={domain.label} />
          ))}
        </div>
      </div>
      <div className="App">
        <h1>Regions</h1>
        <PieChart onSegmentClick={handleSegmentClick} selectedSegment={selectedSegment} />
        <BarChart selectedSegment={selectedSegment} />
        {/* <PieChart onClick={handlePieClick} />
        <BarChart selectedSegment={selectedSegment} /> */}
      </div>

      {/* Charts section */}
      {/* <div className="chart-container">
        <PieChart />
        <BarChart />
      </div> */}
      <div className="chart-container">
        <Bar2Chart />
        <Bar3Chart />
        {/* <Charts /> */}
      </div>
    </Box>
  );
}

export default Home;
