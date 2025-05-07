import React from 'react';
import Sidebar from '../components/Sidebar';
import PromoBanner from '../components/PromoBanner';
import Topbar from '../components/Topbar';


const HomePage = () => (
  <div className=" bg-[#e9944e] " style={{ height: "100vh" }}>
  <Topbar/>
  <div className="flex h-full">
      {/* Sidebar solda */}
      <Sidebar />

      {/* Sağ içerik */}
      <div className="flex-1 p-6 overflow-auto">
        <PromoBanner />
        {/* Diğer içerikler */}
      </div>
    </div>

  </div>
);

export default HomePage; 