import React from 'react';
import './StatCard.css';

function StatCard({ number, label, imageUrl }) {
  return (
    <div className="stat-card">
      <img src={imageUrl} alt={label} className="card-image" />
      <div className="number">{number}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export default StatCard;
