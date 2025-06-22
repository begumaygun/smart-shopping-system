import { useState } from 'react';
import Chatbot from './Chatbot';
import { MessageSquare } from 'lucide-react'; // veya başka bir ikon

const ChatbotWrapper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 bg-white shadow-lg rounded">
          <div className="flex justify-between items-center p-2 bg-orange-500 text-white rounded-t">
            <span>Chatbot</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <Chatbot />
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWrapper;
