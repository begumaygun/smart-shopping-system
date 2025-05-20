import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const StockStatus = () => {
  const [stockData, setStockData] = useState([]);
  const [criticalList, setCriticalList] = useState([]);

  const email = localStorage.getItem("userEmail"); // 🔧 Giriş yapan kullanıcının maili

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
    <div className="p-4 bg-white rounded-xl shadow-lg my-6">
      <h2 className="text-xl font-bold mb-4">📦 Stok Durumu</h2>

      {stockData.length === 0 ? (
        <p className="text-gray-500">Gösterilecek stok verisi yok.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData.slice(0, 20)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis
  dataKey="product_category"
  interval={0}
  angle={-45}
  textAnchor="end"
  tick={{ fontSize: 11 }}
  height={70}
/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="product_stock" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {criticalList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-red-600 font-semibold">⚠ Kritik Stoktaki Ürünler (stok {"<"} 10)</h3>
          <ul className="list-disc list-inside text-sm">
            {criticalList.map((item, idx) => (
              <li key={idx}>Kategori: <b>{item.product_category}</b> — Stok: {item.product_stock}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockStatus;

