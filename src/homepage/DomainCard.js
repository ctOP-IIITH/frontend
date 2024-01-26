import React from 'react';
import './DomainCard.css';

function DomainCard({ icon, label }) {
  return (
    <div className="domain-card">
      <img src={icon} alt={label} />
      <p>{label}</p>
    </div>
  );
}

export default DomainCard;
