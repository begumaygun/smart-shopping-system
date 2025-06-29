import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };

    // 🟢 Önce input temizleniyor (kullanıcı hissi için)
    setInput('');

    // 🟢 Kullanıcı mesajı hemen ekleniyor
    setMessages(msgs => [...msgs, userMsg]);

    const email = localStorage.getItem("userEmail");

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        email: email,
        message: userMsg.text // ← input değil, userMsg.text kullan
      });

      const botMsg = { from: 'bot', text: res.data.reply };
      setMessages(msgs => [...msgs, botMsg]);

    } catch (err) {
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: '⚠️ Server error. Please try again.' }
      ]);
    }
  };

  // Otomatik scroll aşağıya iner
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 p-3 h-full">
      {/* Scrollable mesaj alanı */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-2 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block px-3 py-2 rounded-xl max-w-[80%] break-words ${
                m.from === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Giriş ve buton */}
      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask something..."
          className="flex-1 p-2 px-3 text-sm bg-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
