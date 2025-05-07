import React from 'react';

const categories = [
  'Houseware',
  'Parfumerie',
  'Pet',
  'Auto',
  'Electronics',
  'Toys',
  'Art',
  'Baby',
  'Book',
  'Hygiene',
  'Clothing',
  'Footwear',
  'Flowers',
  'Food',
  'Furniture',
];

const Sidebar = () => (
  <aside className="hidden md:block w-60 bg-white shadow-lg rounded-xl p-6 h-screen mt-2">
    <h2 className="text-lg font-bold mb-4 text-gray-800">Categories</h2>
    <ul className="space-y-0">
      {categories.map((cat) => (
        <li key={cat}>
          <div className="text-gray-700 hover:text-orange-500 text-lg px-0 py-3 cursor-pointer transition-colors font-stretch-50%">{cat}
            </div>
        </li>
      ))}
    </ul>
  </aside>
);

export default Sidebar; 