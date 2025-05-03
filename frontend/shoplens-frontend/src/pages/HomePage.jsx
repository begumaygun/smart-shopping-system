import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';

const HomePage = () => {
  return (
    <div className="space-y-8">
      <HeroSection />
      <h2 className="text-2xl font-bold text-gray-800">Popular Categories</h2>
      <CategoryGrid />
    </div>
  );
};

export default HomePage;
