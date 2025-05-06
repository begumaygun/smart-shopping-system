import React from 'react';

const PromoBoxes = () => (
  <div className="flex flex-col gap-4 min-w-[220px] w-full lg:w-64">
    {/* Discount Box */}
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-start">
      <span className="text-sm text-gray-500 mb-1">Up to <span className="text-orange-500 font-bold">30%</span> OFF</span>
      <span className="font-semibold text-gray-800 mb-2">on select items</span>
      <button className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">See Deals</button>
    </div>
    {/* Product Highlight Box */}
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-start">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://via.placeholder.com/40x40?text=📷" alt="Camera" className="w-10 h-10 object-contain" />
        <span className="font-semibold text-gray-800">Camera Pro X</span>
      </div>
      <button className="text-sm bg-black text-white px-3 py-1 rounded-full font-medium">Shop now</button>
    </div>
  </div>
);

export default PromoBoxes; 