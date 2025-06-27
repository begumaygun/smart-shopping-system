import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OrderTrendsChart = ({ email }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:8000/customer-orders-by-month/${email}`)
        .then((res) => {
          const raw = res.data;

          // Tüm aylar (tam sıra + eksik olanlar sıfırlanır)
          const allMonths = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          const formatted = allMonths.map((month) => ({
            month,
            count: raw[month] || 0,
          }));

          setChartData(formatted);
        })
        .catch((err) => console.error("Sipariş trendi verisi alınamadı:", err));
    }
  }, [email]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-[400px]">
      <h2 className="text-lg font-bold text-gray-700 mb-4">📅 Aylık Sipariş Dağılımı</h2>
      {chartData.length === 0 ? (
        <p className="text-gray-500">Veri bulunamadı.</p>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 11 }}
              height={70}
              label={{ value: "Ay", position: "insideBottom", offset: 5 }}
            />
            <YAxis
              allowDecimals={false}
              label={{ value: "Sipariş", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OrderTrendsChart;
