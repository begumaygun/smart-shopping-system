import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#00C49F", "#FF8042"]; // Teslim & İade renkleri

const ReturnRateChart = () => {
  const [returnData, setReturnData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const res = await axios.get("http://localhost:8000/seller-orders/some-seller@email.com");
        const orders = res.data;

        const total = orders.length;
        const returned = orders.filter(order => order.is_returned === 1).length;
        const delivered = total - returned;

       // Yüzde olarak hesapla
        const returnedPercent = ((returned / total) * 100).toFixed(1);
        const deliveredPercent = ((delivered / total) * 100).toFixed(1);

         setReturnData([
            { name: "Delivered", value: parseFloat(deliveredPercent) },
            { name: "Returned", value: parseFloat(returnedPercent) }
  ]);
      } catch (err) {
        console.error("Veri alınamadı", err);
      }
    };

    fetchOrders();
  }, []);
  console.log(orders[0]);


  return (
    <div className="w-full h-72">
      <h3 className="text-lg font-bold text-center mb-4">İade Oranı</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={returnData}
            cx="50%"
            cy="50%"
            label
            outerRadius={80}
            dataKey="value"
          >
            {returnData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value.toFixed(1)}%`, name]} />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReturnRateChart;
