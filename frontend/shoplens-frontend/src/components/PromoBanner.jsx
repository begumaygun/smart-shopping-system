import React from 'react';

const PromoBanner = () => (
  <div className="mx-[30px] my-10 space-y-12">
    {/* Üst promosyon kutuları */}
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sol büyük kutu */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-3xl shadow-lg p-6 w-full lg:w-2/3">
        <img
          src="hyperx.jpg"
          alt="Big Sale"
          className="w-32 h-32 object-contain -mt-4"
        />
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Big Sale</h1>
          <p className="text-gray-600 mb-4">
            Don't miss out on our biggest discounts of the season!
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow">
            Shop Now
          </button>
        </div>
      </div>

      {/* Sağdaki küçük kutular */}
      <div className="flex flex-col gap-4 w-full lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-center cursor-pointer h-full text-center">
          <p className="text-lg font-semibold text-gray-800">🦋 See your dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-center cursor-pointer h-full text-center">
          <p className="text-lg font-semibold text-gray-800">🔥 Our offers for you</p>
        </div>
      </div>
    </div>

    {/* Alt: Popüler Kategoriler */}
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Popüler Kategoriler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: 'Pet', image: '/dog.jpg' },
          { name: 'Parfumerie', image: '/parfume.jpg' },
          { name: 'Auto', image: '/auto.jpg' },
          { name: 'Electronics', image: '/electronics.jpg' },
        ].map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:bg-orange-100 transition-all cursor-pointer"
          >
            <img src={cat.image} alt={cat.name} className="w-24 h-24 object-contain mb-3" />
            <p className="text-lg font-semibold text-gray-800">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PromoBanner;
