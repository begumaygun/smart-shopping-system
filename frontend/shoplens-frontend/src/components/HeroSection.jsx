import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md mb-8">
      <img
        src="https://images.unsplash.com/photo-1585386959984-a4155224a1a1?auto=format&fit=crop&w=1500&q=80"
        alt="Headphones Promo"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start p-8 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">Big Sale</h1>
        <p className="text-lg md:text-xl mb-4">Up to 50% off on all electronics</p>
        <button className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
