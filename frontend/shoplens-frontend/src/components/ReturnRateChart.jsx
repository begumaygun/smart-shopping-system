import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#00C49F", "#FF8042"];

const ReturnRateChart = () => {
  const [returnData, setReturnData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const res = await axios.get(`http://localhost:8000/seller-orders/${email}`);
        const orders = res.data;

        const total = orders.length;
        const returned = orders.filter(order => parseInt(order.is_returned) === 1).length;
        const delivered = total - returned;

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

  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">İade Oranı</h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Tooltip formatter={(value, name) => [`${value}%`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReturnRateChart;
