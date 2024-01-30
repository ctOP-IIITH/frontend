import { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import StatCard from './StatCard';
import DomainCard from './DomainCard';
import PieChart from './piechart';
import AreaTable from './table';
import Bar2Chart from './bar2chart';
import Bar3Chart from './bar3chart';
// import Pie2Chart from './pie2chart';
import './Home.css';

// Assets
import domainImage from './assets/domain.png';
import airQualityImage from './assets/air-quality.png';
import waterQualityImage from './assets/water-quality.png';
import waterQuantityImage from './assets/water-quantity.png';
import wasteImage from './assets/waste-management.png';
import energyMonitoringImage from './assets/energy-monitoring.png';
import streetLightImage from './assets/street-light.png';

import domainsImage from './assets/stats/domains.png';
import nodesImage from './assets/stats/nodes.png';
import regionsImage from './assets/stats/regions.png';
import sensorsImage from './assets/stats/sensors.png';
import { axiosAuthInstance } from '../services/axiosConfig';

const domainData = [
  { icon: domainImage, label: 'All Domains' },
  { icon: airQualityImage, label: 'Air Quality' },
  { icon: waterQualityImage, label: 'Water Quality' },
  { icon: waterQuantityImage, label: 'Water Quantity' },
  { icon: streetLightImage, label: 'Street Light' },
  { icon: wasteImage, label: 'Waste Management' },
  { icon: energyMonitoringImage, label: 'Energy Monitoring' }
];

function Home() {
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [lonerStats, setLonerStats] = useState({
    total_areas: 0,
    total_domains: 0,
    total_sensor_types: 0,
    total_nodes: 0
  });

  const handleSegmentClick = (index) => {
    setSelectedSegment(index);
  };

  useEffect(() => {
    axiosAuthInstance.get('/stats/loners').then((response) => {
      setLonerStats(response.data);
    });
  }, []);

  return (
    <div className="home">
      <div className="main-image">
        <Container maxWidth="sm">
          <Typography variant="h3" align="center" color="#123462" gutterBottom>
            Hyderabad
          </Typography>
        </Container>
        {/* <Header /> */}

        <div className="stats-container">
          <StatCard number={lonerStats.total_areas} label="Areas" imageUrl={regionsImage} />
          <StatCard number={lonerStats.total_domains} label="Domains" imageUrl={domainsImage} />
          <StatCard
            number={lonerStats.total_sensor_types}
            label="Sensor Types"
            imageUrl={nodesImage}
          />
          <StatCard number={lonerStats.total_nodes} label="Nodes" imageUrl={sensorsImage} />
        </div>
      </div>
      {/* <MainImage /> */}

      {/* Domain cards section */}
      <div className="domain-cards-container">
        <h2>Discover by Domains</h2>
        <div className="domain-cards">
          {domainData.map((domain) => (
            <DomainCard key={domain.label} icon={domain.icon} label={domain.label} />
          ))}
        </div>
      </div>
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
          <AreaTable selectedSegment={selectedSegment} />
        </div>
      </div>
    </div>
  );
}

export default Home;
