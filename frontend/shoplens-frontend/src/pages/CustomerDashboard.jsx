import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import CustomerPersonaCard from "../components/CustomerPersonaCard";
import OrderTrendsChart from "../components/OrderTrendsChart";
import CategoryPieChart from "../components/CategoryPieChart";
import ChatbotWrapper from "../components/ChatbotWrapper";



const CustomerDashboard = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="bg-[#d9d9d9] min-h-screen">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto space-y-8">
          {/* Persona Kartı */}
          <CustomerPersonaCard email={email} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderTrendsChart email={email} />
            <CategoryPieChart email={email} />
          </div>
          <ChatbotWrapper />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
