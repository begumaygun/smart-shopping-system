import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const TopCategoriesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/top-categories")
      .then((res) => {
        const formatted = Object.entries(res.data).map(([name, count]) => ({
          name: name
          .replace("_", " ")
          .replace("computers accessories", "computers")
          .replace("furniture decor", "furniture"),
          count,

        }));
        setData(formatted);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error.message);
      });
  }, []);

  return (
    <div className="bg-white p-6  rounded-2xl shadow-md h-60 w-[600px]  ml-4 mb-20">
  <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
  <ResponsiveContainer width="100%" height="90%">
    <BarChart data={data}
    margin={{ top: 5, right: 5, left: 5, bottom: 30 }}>
      <XAxis
        dataKey="name"
        interval={0}
        angle={0}
        textAnchor="middle"
        dy={10}
        tick={{ fontSize: 13 }}
        label={{ value: "Kategori", position: "insideBottom", offset: -20 }} // 🔧 offset artırıldı
      />
      <YAxis
        label={{ value: "Adet", angle: -90, position: "insideLeft" }}
      />
      <Tooltip />
      <Bar dataKey="count" fill="#001f3f" />
    </BarChart>
  </ResponsiveContainer>
</div>


  );
};

export default TopCategoriesChart;
