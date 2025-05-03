import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-2xl font-bold">ShopLens</div>
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-3 py-1 w-1/2"
      />
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-gray-200 w-8 h-8"></button>
        <button className="rounded-full bg-gray-200 w-8 h-8"></button>
      </div>
    </nav>
  );
};

export default Navbar;
