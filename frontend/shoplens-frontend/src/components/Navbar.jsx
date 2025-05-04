import React from 'react';
import { FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md px-8 py-4">
      <div className="flex items-center justify-between">
        
        {/* Sol - Logo */}
        <div className="text-2xl font-bold text-gray-800">ShopLens</div>

        {/* Orta - Arama */}
        <div className="w-1/2 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Sağ - İkonlar */}
        <div className="flex items-center gap-6 text-gray-600 text-xl">
          <button title="Favorites">
            <FiHeart className="hover:text-orange-500 transition" />
          </button>
          <button title="Cart">
            <FiShoppingCart className="hover:text-orange-500 transition" />
          </button>
          <button title="Profile">
            <FiUser className="hover:text-orange-500 transition" />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
