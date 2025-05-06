import React from 'react';

const PromoBanner = () => (
  <div className="flex-1">
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg p-8">
      <img src="https://via.placeholder.com/140x140?text=🛍️" alt="Big Sale" className="w-32 h-32 object-contain" />
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Big Sale</h1>
        <p className="text-gray-600 mb-4">Don't miss out on our biggest discounts of the season!</p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow">Shop Now</button>
      </div>
    </div>
  </div>
);


export default PromoBanner; 