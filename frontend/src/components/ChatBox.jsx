import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatBox = ({ appointmentId, sender }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!appointmentId) return;

    socket.emit('joinRoom', { roomId: appointmentId });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [appointmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit('sendMessage', {
      roomId: appointmentId,
      sender,
      text: message,
    });

    setMessage('');
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', maxWidth: 500 }}>
      <div style={{ height: 250, overflowY: 'scroll', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="Type message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '75%' }}
      />
      <button onClick={handleSend} style={{ width: '23%', marginLeft: '2%' }}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
