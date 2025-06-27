import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8000/seller-revenue/${email}`)
        .then((res) => {
          console.log("📈 Aylık gelir verisi:", res.data.monthly_revenue);
          setRevenueData(res.data.monthly_revenue);
        })
        .catch((err) => console.error("Gelir verisi alınamadı:", err));
    }
  }, [email]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-[600px] h-72 ml-4">
      <h2 className="text-lg font-semibold mb-2">Aylık Toplam Gelir (₺)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_revenue" stroke="#001f3f" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
