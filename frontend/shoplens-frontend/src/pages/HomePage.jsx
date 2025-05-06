import React from 'react';
import Sidebar from '../components/Sidebar';
import PromoBanner from '../components/PromoBanner';
import Topbar from '../components/Topbar';


const HomePage = () => (
  <div className=" bg-[#a32a2a] flex-1" style={{ height: "100vh" }}>
  <Topbar/>

   <Sidebar />
    <PromoBanner />
  </div>
);

export default HomePage; 