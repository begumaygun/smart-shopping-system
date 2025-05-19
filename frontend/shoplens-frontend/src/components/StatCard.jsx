// components/StatCard.jsx
import React from 'react';
import { FaStar } from "react-icons/fa";

const StatCard = ({ title, value, icon }) => {
  const renderStars = () => {
    const fullStars = Math.round(value);
    return (
      <div className="flex justify-center space-x-1 mt-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={18}
            color={i < fullStars ? "#facc15" : "#e5e7eb"} // sarı ve gri
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 text-center w-full max-w-sm">
      <div className="text-3xl mb-2">
        {icon === "stars" ? null : icon}
      </div>
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-2xl font-bold text-indigo-600">{value} {icon === "stars" && "/ 5"}</p>
      {icon === "stars" && renderStars()}
    </div>
  );
};

export default StatCard;
