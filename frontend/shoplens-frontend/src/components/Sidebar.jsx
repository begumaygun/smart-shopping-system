import React from 'react';

const categories = [
  'Houseware',
  'Parfumerie',
  'Pet',
  'Auto',
  'Electronics',
  'Toys',
];

const Sidebar = () => (
  <aside className="hidden md:block w-20 bg-white shadow-lg rounded-xl p-6 h-fit mt-2">
    <h2 className="text-lg font-bold mb-4 text-gray-800">Categories</h2>
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li key={cat} className="text-gray-700 hover:text-orange-500 cursor-pointer transition-colors font-medium">{cat}</li>
      ))}
    </ul>
  </aside>
);

export default Sidebar; 