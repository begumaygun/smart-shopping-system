import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import StatCard from "../components/StatCard";
import ReturnRateChart from "../components/ReturnRateChart";
import { Repeat } from 'lucide-react';
import StockStatus from "../components/StockStatus";
import ChatbotWrapper from '../components/ChatbotWrapper';
import RevenueChart from "../components/RevenueChart";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f'];

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [avgDelivery, setAvgDelivery] = useState(null);
  const [sellerId, setSellerId] = useState("");
  const [efficiency, setEfficiency] = useState(null);
  const [avgReviewScore, setAvgReviewScore] = useState(null);
  const [repeatRatio, setRepeatRatio] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);

    const fetchSellerOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/seller-orders/${storedEmail}`);
        setOrders(response.data);

        const userResp = await axios.get("http://localhost:8000/all-users");
        const sellerData = userResp.data.find(u => u.email === storedEmail);

        if (sellerData?.seller_id) {
          setSellerId(sellerData.seller_id);
          const deliveryResp = await axios.get(`http://localhost:8000/seller-delivery-stats/${sellerData.seller_id}`);
          setAvgDelivery(deliveryResp.data.avg_delivery_days);
        }

        const effResp = await axios.get(`http://localhost:8000/seller-efficiency/${storedEmail}`);
        setEfficiency(effResp.data.avg_delivery_per_product);

        const reviewResp = await axios.get(`http://localhost:8000/seller-review-score/${storedEmail}`);
        setAvgReviewScore(reviewResp.data.avg_review_score);

      } catch (error) {
        console.error("Satıcı siparişleri alınamadı:", error);
      }
    };

    fetchSellerOrders();
  }, []);

  const cityCounts = orders.reduce((acc, order) => {
    acc[order.customer_city] = (acc[order.customer_city] || 0) + 1;
    return acc;
  }, {});
  const cityData = Object.entries(cityCounts).map(([city, count]) => ({
    name: city,
    value: count,
  }));

  const categoryCounts = orders.reduce((acc, order) => {
    acc[order.product_category] = (acc[order.product_category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    value: count,
  }));

  const totalOrders = orders.length;
  const uniqueCategories = Object.keys(categoryCounts).length;
  const uniqueCities = Object.keys(cityCounts).length;

  useEffect(() => {
    if (orders.length > 0) {
      const validRatios = orders
        .map(order => {
          const raw = order.repeat_purchase_ratio;
          const val = typeof raw === "string" ? parseFloat(raw.replace(",", ".")) : parseFloat(raw);
          return isNaN(val) ? null : val;
        })
        .filter(val => val !== null);

      if (validRatios.length > 0) {
        const meanRatio = validRatios.reduce((sum, val) => sum + val, 0) / validRatios.length;
        setRepeatRatio(meanRatio);
      } else {
        setRepeatRatio(0);
      }
    }
  }, [orders]);

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700">Satıcı Paneli</h1>
      <p className="text-gray-600 mt-2">Giriş yapan: <strong>{email}</strong></p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-6">
        <StatCard title="Toplam Sipariş" value={totalOrders} icon="📦" />
        <StatCard title="Kategori Çeşidi" value={uniqueCategories} icon="📂" />
        <StatCard title="Gönderilen Şehir" value={uniqueCities} icon="🌆" />
        {avgDelivery !== null && (
          <StatCard title="Ortalama Teslim Süresi" value={`${avgDelivery} gün`} icon="🚚" />
        )}
        {efficiency !== null && (
          <StatCard title="Ürün Başına Teslim Süresi" value={`${efficiency} gün`} icon="⏱️" />
        )}
        {avgReviewScore !== null && (
          <StatCard title="Müşteri Memnuniyeti" value={avgReviewScore} icon="stars" />
        )}
        <StatCard
          title="Tekrar Alışveriş Oranı"
          value={`${(repeatRatio * 100).toFixed(1)}%`}
          icon={<Repeat className="text-orange-500" />}
        />

        <ChatbotWrapper />
      </div>

      {orders.length === 0 ? (
  <p className="mt-10 text-gray-500">Henüz sipariş yok.</p>
) : (
  <>
    {/* Üstteki 2 grafik yan yana */}
    <div className="grid md:grid-cols-2 gap-12 mt-10">
      {/* Şehir Dağılımı */}
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sipariş Şehir Dağılımı</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityData} margin={{ top: 5, right: 10, left: 10, bottom: 75 }}>
            <XAxis
              dataKey="name"
              interval={0}
              angle={-35}
              textAnchor="end"
              label={{ value: "Şehir", position: "insideBottom", offset: -60 }}
            />
            <YAxis label={{ value: "Sipariş", angle: -90, position: "insideLeft" }} />
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
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
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

    {/* Gelir & Stok Durumu yan yana */}
    <div className="grid md:grid-cols-2 gap-12 mt-10">
      <div className="bg-white shadow-xl rounded-xl p-6 h-[350px] w-full">
        <RevenueChart />
      </div>
      <div>
        <StockStatus />
      </div>
    </div>

    {/* İade Oranı (tek başına alta) */}
    <div className="mt-10">
      <ReturnRateChart />
    </div>
  </>
)}

    </div>
  );
};

export default SellerDashboard;
