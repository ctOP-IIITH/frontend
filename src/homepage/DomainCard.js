import React from 'react';
import './DomainCard.css'; // Make sure to create this CSS file for styling

function DomainCard({ icon, label }) {
  return (
    <div className="domain-card">
      <img src={icon} alt={label} />
      <p>{label}</p>
    </div>
  );
}

export default DomainCard;
