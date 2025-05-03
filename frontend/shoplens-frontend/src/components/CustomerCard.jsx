import React from 'react';

const CustomerCard = ({ customer }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-2">{customer.name}</h2>
      <p className="text-gray-600 mb-1"><strong>Segment:</strong> {customer.segment}</p>
      <p className="text-gray-600 mb-1"><strong>Total Orders:</strong> {customer.total_orders}</p>
      <p className="text-gray-600 mb-1"><strong>Avg. Order Value:</strong> ${customer.avg_order_value}</p>
      <p className="text-gray-600 mb-1"><strong>Review Score:</strong> {customer.avg_review_score} / 5</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        View Recommendations
      </button>
    </div>
  );
};

export default CustomerCard;
