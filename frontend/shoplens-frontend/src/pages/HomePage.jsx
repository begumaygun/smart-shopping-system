import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import PromoBanner from '../components/PromoBanner';
import Topbar from '../components/Topbar';
import TopCategoriesChart from "../components/TopCategoriesChart";
import ChatbotWrapper from '../components/ChatbotWrapper';


const HomePage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (!savedEmail) {
      navigate("/login");
    } else {
      setEmail(savedEmail);
    }
  }, []);

  return (
    <div className="bg-[#D9D9D9]" style={{ height: "100vh" }}>
      <Topbar />
      <div className="flex h-full">
        {/* Sidebar solda */}
        <Sidebar />

        {/* Sağ içerik */}
        <div className="flex-1 p-6 overflow-auto">
          <PromoBanner />
          <TopCategoriesChart />

          
          {/* Kullanıcıya özel mesaj */}
          <p className="text-sm mt-6 text-gray-100">
            Giriş yapan kullanıcı: <strong>{email}</strong>
          </p>
        </div>
      </div>
      <ChatbotWrapper />
    </div>
  );
};

export default HomePage;
