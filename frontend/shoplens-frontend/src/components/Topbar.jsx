import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function Topbar() {
  const navigate = useNavigate();
  return (
    <div className='flex-1' >
      <header className="w-full bg-white shadow-md rounded-b-xl px-6 py-4 grid grid-cols-3 items-center sticky top-0 z-10">
  {/* Sol: Logo */}
  <div className="flex items-center gap-2 text-2xl font-bold text-orange-500 cursor-pointer bg-[#fff]">
   <span className="ml-2 text-[#e9944e] font-bold text-lg">ShopLens</span>
  </div>

  {/* Orta: Search */}
  <div className="flex justify-center">
    <input
      type="text"
      placeholder="Search for products..."
      className="w-full max-w-md px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
    />
  </div>

  {/* Sağ: Icons */}
  <div className="flex justify-end items-center gap-6 text-2xl">
    <button title="Favorites" className="hover:text-orange-500 transition-colors">❤️</button>
    <button title="Cart" className="hover:text-orange-500 transition-colors">🛒</button>
    <button title="User"
        onClick={() => navigate('/login')}
        className="hover:text-orange-500 transition-colors"
      >
      <span className=" w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">👤</span>
    </button>
  </div>
</header>

    </div>
  )
}
