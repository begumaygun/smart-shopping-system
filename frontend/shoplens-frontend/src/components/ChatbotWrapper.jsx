import { useState } from 'react';
import Chatbot from './Chatbot';
import { MessageSquare } from 'lucide-react';

const ChatbotWrapper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-[350px] h-[450px] bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col border border-orange-300">
          <div className="flex items-center justify-between bg-orange-500 text-white px-4 py-2">
            <span className="font-semibold">Chatbot Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white text-lg font-bold">
              ✖
            </button>
          </div>
          <Chatbot />
        </div>
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg"
          aria-label="Open Chatbot"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWrapper;
