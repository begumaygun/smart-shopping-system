import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerPersonaCard = ({ email }) => {
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8000/user-persona/${email}`)
        .then(res => setPersona(res.data))
        .catch(err => console.error("Persona verisi alınamadı:", err));
    }
  }, [email]);

  if (!persona) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-gray-500">Persona bilgisi yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-orange-600">🧠 Alışveriş Karakterin</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <PersonaItem label="Genel Profil" value={persona.persona_code} emoji="🧬" />
        <PersonaItem label="Yorum Tarzı" value={persona.review_style} emoji="💬" />
        <PersonaItem label="Harcama Tarzı" value={persona.order_style} emoji="💳" />
        <PersonaItem label="Alışkanlık Tipi" value={persona.repeat_style} emoji="🔁" />
        <PersonaItem label="Ürün Tercihi" value={persona.weight_style} emoji="📦" />
        <PersonaItem label="Ziyaret Sıklığı" value={persona.activity_style} emoji="📅" />
      </div>
    </div>
  );
};

const PersonaItem = ({ label, value, emoji }) => (
  <div className="bg-orange-50 p-4 rounded-md shadow text-center">
    <div className="text-2xl mb-2">{emoji}</div>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

export default CustomerPersonaCard;
