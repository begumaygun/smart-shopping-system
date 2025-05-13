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

      alert(response.data.message); // Giriş başarılı
      localStorage.setItem("userEmail", email); // E-postayı sakla
      await axios.post('http://localhost:8000/login-log', { email }); // Giriş logu
      navigate('/homepage'); // Ana sayfaya yönlendir

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
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl h-[600px]">
        <h2 className="text-3xl font-bold text-purple-700 text-center">Sign In</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Welcome to ShopLens</p>

        <form onSubmit={handleLogin} className="flex flex-col justify-between h-[400px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
