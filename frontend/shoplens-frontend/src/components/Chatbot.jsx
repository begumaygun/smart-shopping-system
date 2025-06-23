import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
  if (!input.trim()) return;
  const userMsg = { from: 'user', text: input };
  setMessages(msgs => [...msgs, userMsg]);

  const email = localStorage.getItem("userEmail"); // <- email buradan alınıyor

  try {
    const res = await axios.post('http://localhost:8000/chat', {
      email: email,
      message: input
    });
    const botMsg = { from: 'bot', text: res.data.reply };
    setMessages(msgs => [...msgs, botMsg]);
  } catch (err) {
    setMessages(msgs => [...msgs, { from: 'bot', text: 'Server error.' }]);
  }

  setInput('');
};

  return (
    <div className="bg-white shadow-md rounded p-4">
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
            <span className="inline-block px-3 py-1 rounded bg-gray-200">
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
