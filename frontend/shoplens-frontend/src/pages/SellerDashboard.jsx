import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f'];

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);

    const fetchSellerOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/seller-orders/${storedEmail}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Satıcı siparişleri alınamadı:", error);
      }
    };

    fetchSellerOrders();
  }, []);

  // 🔹 Şehir bazlı sipariş sayısı
  const cityCounts = orders.reduce((acc, order) => {
    acc[order.customer_city] = (acc[order.customer_city] || 0) + 1;
    return acc;
  }, {});
  const cityData = Object.entries(cityCounts).map(([city, count]) => ({
    name: city,
    value: count,
  }));

  // 🔹 Kategori bazlı sipariş sayısı
  const categoryCounts = orders.reduce((acc, order) => {
    acc[order.product_category] = (acc[order.product_category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    value: count,
  }));

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700">Satıcı Paneli</h1>
      <p className="text-gray-600 mt-2">Giriş yapan: <strong>{email}</strong></p>

      {orders.length === 0 ? (
        <p className="mt-10 text-gray-500">Henüz sipariş yok.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-12 mt-10">
          {/* Şehir Dağılımı */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Sipariş Şehir Dağılımı</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Kategori Dağılımı */}
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ürün Kategori Dağılımı</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
