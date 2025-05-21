import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Make a POST request to FastAPI endpoint
      const response = await fetch('http://127.0.0.1:8000/generate_response/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }), // Send the input text to FastAPI
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg = { sender: 'bot', text: data.response };  // Bot's response
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Sorry, I’m not available right now.' },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'There was an error processing your request.' },
      ]);
    }

    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button 💬 */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="mt-2 w-[500px] h-[500px] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col">
          <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span>Medical Chatbot</span>
            <button onClick={() => setIsOpen(false)} className="text-white font-bold">&times;</button>
          </div>
          <div className="h-50 overflow-y-auto p-2 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded-lg max-w-[35%] ${msg.sender === 'user'
                  ? 'bg-blue-100 self-end ml-auto text-right'
                  : 'bg-green-100 self-start mr-auto text-left'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t p-2 mt-4">
            <input
              className="flex-1 text-sm border px-3 py-1 rounded-l focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
