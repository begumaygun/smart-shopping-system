// components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
};

export default StatCard;
