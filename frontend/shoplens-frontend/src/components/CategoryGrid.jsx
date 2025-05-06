import React from 'react';

const categories = [
  { name: 'Furniture', icon: '🪑' },
  { name: 'Accessories', icon: '👜' },
  { name: 'Clothes', icon: '👗' },
  { name: 'Tech', icon: '💻' },
];

const CategoryGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {categories.map((cat) => (
      <div key={cat.name} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow cursor-pointer">
        <span className="text-4xl mb-3">{cat.icon}</span>
        <span className="font-medium text-gray-800 text-center text-lg">{cat.name}</span>
      </div>
    ))}
  </div>
);

export default CategoryGrid; 