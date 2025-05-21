// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');  // Your backend URL

// const DoctorChat = ({ appointmentId, doctorName }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//     // Join the appointment room
//     socket.emit('joinRoom', { roomId: appointmentId });

//     // Listen for incoming messages
//     socket.on('receiveMessage', (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });




//     // Cleanup on unmount
//     return () => {
//       socket.off('receiveMessage');
//       socket.emit('leaveRoom', { roomId: appointmentId });
//     };
//   }, [appointmentId]);

//   const sendMessage = () => {
//     if (input.trim() === '') return;

//     const msgObj = {
//       roomId: appointmentId,
//       sender: doctorName,
//       text: input,
//       // No timestamp here
//     };

//     socket.emit('sendMessage', msgObj);  // Send to server
//     setMessages((prev) => [...prev, msgObj]);  // Show in own chat
//     setInput('');
//   };

//   return (
//     <div>
//       <h3>Chat for appointment: {appointmentId}</h3>
//       <div style={{ maxHeight: 300, overflowY: 'scroll', border: '1px solid gray', padding: 10 }}>
//         {messages.map((msg, i) => (
//           <div key={i}>
//             <b>{msg.sender}:</b> {msg.text}
//             {/* No timestamp display */}
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type your message"
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default DoctorChat;




// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');  // backend URL

// const DoctorChat = ({ appointmentId, doctorName }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socket.emit('joinRoom', { roomId: appointmentId });

//     const handleReceive = (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     };

//     socket.on('receiveMessage', handleReceive);

//     return () => {
//       socket.off('receiveMessage', handleReceive);
//       socket.emit('leaveRoom', { roomId: appointmentId });
//     };
//   }, [appointmentId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = () => {
//     if (input.trim() === '') return;

//     const msgObj = {
//       roomId: appointmentId,
//       sender: doctorName,
//       text: input,
//     };

//     socket.emit('sendMessage', msgObj);
//     setMessages((prev) => [...prev, msgObj]);
//     setInput('');
//   };

//   return (
//     <div style={styles.chatContainer}>
//       <div style={styles.header}>
//         <h3 style={{ margin: 0 }}>Chat - Appointment: {appointmentId}</h3>
//       </div>

//       <div style={styles.messagesContainer}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               ...styles.message,
//               alignSelf: msg.sender === doctorName ? 'flex-end' : 'flex-start',
//               backgroundColor: msg.sender === doctorName ? '#007bff' : '#e4e6eb',
//               color: msg.sender === doctorName ? 'white' : 'black',
//             }}
//           >
//             <b>{msg.sender}</b>: {msg.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div style={styles.inputArea}>
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           style={styles.input}
//           onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
//         />
//         <button onClick={sendMessage} style={styles.sendButton}>Send</button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   chatContainer: {
//     width: '500px',
//     height: '300px',
//     display: 'flex',
//     flexDirection: 'column',
//     borderRadius: '10px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//     backgroundColor: 'white',
//     border: '1px solid #ccc',
//     position: 'relative',
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   header: {
//     padding: '15px',
//     borderBottom: '1px solid #ddd',
//     backgroundColor: '#007bff',
//     color: 'white',
//     borderTopLeftRadius: '10px',
//     borderTopRightRadius: '10px',
//   },
//   messagesContainer: {
//     flex: 1,
//     padding: '15px',
//     overflowY: 'auto',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     backgroundColor: '#f8f9fa',
//   },
//   message: {
//     maxWidth: '70%',
//     padding: '10px 15px',
//     borderRadius: '20px',
//     fontSize: '14px',
//     lineHeight: '20px',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//   },
//   inputArea: {
//     display: 'flex',
//     padding: '10px 15px',
//     borderTop: '1px solid #ddd',
//     gap: '10px',
//   },
//   input: {
//     flex: 1,
//     borderRadius: '20px',
//     border: '1px solid #ccc',
//     padding: '10px 15px',
//     fontSize: '14px',
//     outline: 'none',
//   },
//   sendButton: {
//     backgroundColor: '#007bff',
//     border: 'none',
//     borderRadius: '20px',
//     color: 'white',
//     padding: '10px 20px',
//     cursor: 'pointer',
//     fontWeight: '600',
//     transition: 'background-color 0.3s ease',
//   },
// };

// export default DoctorChat;




import React, { useState, useEffect, useRef } from 'react';
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
    <div style={{ border: '1px solid #ddd', padding: 10, maxWidth: 500, fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ height: 250, overflowY: 'auto', marginBottom: 10 }}>
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
        style={{ width: '75%', padding: 8, fontSize: 14, border: '1px solid #ccc', borderRadius: 4 }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
      />
      <button
        onClick={handleSend}
        style={{
          width: '23%',
          marginLeft: '2%',
          padding: 8,
          fontSize: 14,
          cursor: 'pointer',
          borderRadius: 4,
          border: '1px solid #007bff',
          backgroundColor: '#007bff',
          color: 'white',
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatBox;
