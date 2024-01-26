// import React from 'react';
import React, { useState } from 'react';
import { Box } from '@mui/system';
import { Typography, Container } from '@mui/material';
// import Header from './header';
import StatCard from './StatCard';
// import Charts from './Charts';
import DomainCard from './DomainCard';
// import { IoSwapVerticalSharp } from 'react-icons/io5';
import PieChart from './piechart';
import BarChart from './barchart';
import Bar2Chart from './bar2chart';
import Bar3Chart from './bar3chart';
// import Pie2Chart from './pie2chart';
import './Home.css';

const domainData = [
  { icon: './domain.png', label: 'All Domains' },
  { icon: './air-quality.jpg', label: 'Air Quality' },
  { icon: './waterQuality.png', label: 'Water Quality' },
  { icon: './water-quantity.png', label: 'Water Quantity' },
  { icon: './crowd mon.png', label: 'Crowd Monitoring' },
  { icon: './wisun.jpg', label: 'WiSUN' },
  { icon: './srac.jpg', label: 'Smart AC' },
  { icon: './weatherxx.jpg', label: 'Weather Monitoring' }
];

function Home() {
  const [selectedSegment, setSelectedSegment] = useState(0);

  const handleSegmentClick = (index) => {
    setSelectedSegment(index);
  };

  return (
    <Box className="home">
      <div className="main-image">
        <Container maxWidth="sm">
          <Typography variant="h3" align="center" color="#1d2994" gutterBottom>
            Hyderabad
          </Typography>
        </Container>
        {/* <Header /> */}

        <div className="stats-container">
          <StatCard number="37" label="Regions" imageUrl="./cities.jpg" />
          <StatCard number="9" label="Domains" imageUrl="./domainxx.jpg" />
          <StatCard number="48" label="Nodes" imageUrl="./nodes.jpg" />
          <StatCard number="167" label="Sensors" imageUrl="./sensor.jpg" />
        </div>
      </div>
      {/* <MainImage /> */}

      {/* Domain cards section */}
      <div className="domain-cards-container">
        <h2>Discover by domains</h2>
        <div className="domain-cards">
          {domainData.map((domain) => (
            <DomainCard key={domain.label} icon={domain.icon} label={domain.label} />
          ))}
        </div>
      </div>
      {/* <div className="App">
        <h1>Regions</h1>
        <PieChart onSegmentClick={handleSegmentClick} selectedSegment={selectedSegment} />
        <BarChart selectedSegment={selectedSegment} />
      </div> */}
      <div className="chart-container">
        <div className="chart-card">
          <Bar2Chart />
        </div>
        <div className="chart-card">
          <Bar3Chart />
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-card">
          <PieChart onSegmentClick={handleSegmentClick} selectedSegment={selectedSegment} />
        </div>
        <div className="chart-card">
          <BarChart selectedSegment={selectedSegment} />
        </div>
      </div>
    </Box>
  );
}

export default Home;
