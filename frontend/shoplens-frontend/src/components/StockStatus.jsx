import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StockStatus = () => {
  const [stockData, setStockData] = useState([]);
  const [criticalList, setCriticalList] = useState([]);

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8000/seller-stock/${email}`)
        .then((res) => {
          console.log("📊 Gelen stok verisi:", res.data);
          setStockData(res.data.all_stock);
          setCriticalList(res.data.critical_stock);
        })
        .catch((err) => console.error("Stok verisi alınamadı:", err));
    }
  }, [email]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md h-auto w-[600px] ml-4">
      <h2 className="text-lg font-semibold mb-2">Stok Durumu</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={stockData.slice(0, 20)}
          margin={{ top: 20, right: 15, left: 15, bottom: 40 }}
        >
          <XAxis
            dataKey="product_category"
            interval={0}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 10 }}
            height={80}
            label={{ value: "Kategori", position: "insideBottom", offset: 10 }}
          />
          <YAxis
            label={{ value: "Stok", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Bar dataKey="product_stock" fill="#001f3f" />
        </BarChart>
      </ResponsiveContainer>

      {criticalList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-red-600 font-semibold">⚠ Kritik Stoktaki Ürünler (stok {"<"} 10)</h3>
          <ul className="list-disc list-inside text-sm">
            {criticalList.map((item, idx) => (
              <li key={idx}>
                Kategori: <b>{item.product_category}</b> — Stok: {item.product_stock}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockStatus;
