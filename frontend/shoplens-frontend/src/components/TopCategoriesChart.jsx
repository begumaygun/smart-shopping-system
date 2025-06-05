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
    <div className="bg-white p-6 rounded-2xl shadow-md w-full h-96">
      <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            interval={0}
            angle={-45}
            textAnchor="end"
            label={{ value: "Kategori", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{ value: "Adet", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCategoriesChart;
