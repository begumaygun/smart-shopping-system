import React from 'react';

const categories = [
  { name: 'Electronics', image: 'https://via.placeholder.com/400x300?text=Electronics' },
  { name: 'Computers', image: 'https://source.unsplash.com/400x300/?computer' },
  { name: 'Clothes', image: 'https://source.unsplash.com/400x300/?clothes' },
  { name: 'Beauty', image: 'https://source.unsplash.com/400x300/?makeup' },
  { name: 'Toys & Games', image: 'https://source.unsplash.com/400x300/?toys' },
  { name: 'Home Design', image: 'https://source.unsplash.com/400x300/?interior' },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <div key={index} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
          <img src={category.image} alt={category.name} className="w-full h-40 object-cover" />
          <div className="p-4 bg-white">
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
