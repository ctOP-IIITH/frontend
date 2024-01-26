import React from 'react';
import './StatCard.css';

function StatCard({ number, label }) {
  return (
    <div className="stat-card">
      <div className="number">{number}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export default StatCard;
