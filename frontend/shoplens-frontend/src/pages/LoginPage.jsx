import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        email,
        password
      });

      const { message, role } = response.data;

      //alert(message); // Giriş başarılı
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);
      await axios.post('http://localhost:8000/login-log', { email });

      // 🔁 Rol kontrolü ile yönlendirme
      if (role === "customer") {
        navigate("/homepage");
      } else if (role === "seller") {
        navigate("/seller-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        alert("Bilinmeyen kullanıcı rolü!");
      }

    } catch (error) {
      const detail = error.response?.data?.detail;
      const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
      alert("Giriş başarısız: " + message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-end pr-20"
      style={{ backgroundImage: "url('/rocket-bg.png')" }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl h-[500px] bg-cover bg-center flex-col justify-center items-center md:px-10 m-20 ">
        <h2 className="text-6xl font-bold text-purple-700 text-center">Sign In</h2>
        <p className="text-2xl text-center text-gray-500 mb-6 mt-2">Welcome to ShopLens</p>

        <form onSubmit={handleLogin} className="flex flex-col justify-around  h-[400px]">
         <div className="flex flex-col gap-12">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-lg w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" text-lg w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          </div>
          <button
            type="submit"
            className="text-2xl w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition mb-10 "
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
