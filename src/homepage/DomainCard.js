import React from 'react';
import { useNavigate } from 'react-router-dom';

import './DomainCard.css';

function DomainCard({ icon, label }) {
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(`/details?filter=${label === 'All Domains' ? 'Water Quality' : label}`);
    }
  };
  return (
    <div
      className="domain-card"
      onClick={() =>
        navigate(`/details?filter=${label === 'All Domains' ? 'Water Quality' : label}`)
      }
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}>
      <img src={icon} alt={label} />
      <p>{label}</p>
    </div>
  );
}

export default DomainCard;
