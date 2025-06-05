import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f",
  "#a28fd0", "#f5a623", "#ff6384", "#36a2eb", "#4bc0c0"
];

const CategoryPieChart = ({ email }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:8000/customer-category-distribution/${email}`)
        .then((res) => {
          const formatted = Object.entries(res.data).map(([name, value]) => ({
            name,
            value,
          }));
          setData(formatted);
        })
        .catch((err) => console.error("Kategori verisi alınamadı:", err));
    }
  }, [email]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-[400px]">
      <h2 className="text-lg font-bold text-gray-700 mb-4">🛍️ En Çok Alışveriş Yapılan Kategoriler</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">Veri bulunamadı.</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryPieChart;
