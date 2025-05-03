import React from 'react';

const categories = [
  "Electronics", "Computers", "Clothes", "Arts & Crafts", "Toys & Games",
  "Jewelry", "Beauty & Care", "Mother & Kids", "Home Design", "Sports", "Pet Supplies"
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="text-gray-700 hover:text-black cursor-pointer">
            {category}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
