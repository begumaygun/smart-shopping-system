import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SellerDashboard from './pages/SellerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
