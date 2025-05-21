import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import ChatbotRoute from "./routes/ChatbotRoute.js";
import chatRoute from "./routes/chatRoute.js"; // Import the chatRoute
import http from "http";  // Import HTTP to create the server
import { Server } from "socket.io";  // Correct ES Module import syntax
import reviewRoutes from './routes/review.js';

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()




// Create an HTTP server and pass the express app to it
const server = http.createServer(app);

// Create socket.io instance and attach it to the server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // allow both frontends
    methods: ["GET", "POST"]
  }
});


// socket.io connection and events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId); // Join the room for this appointment
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', (message) => {
    console.log('Message:', message);

    // Send the message to everyone in the specific room
    io.to(message.roomId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// review fetching api
// GET /api/reviews/:doctorId






// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api", ChatbotRoute); // 👈 Add this line

app.get("/", (req, res) => {
  res.send("API Working")
});
    

app.use('/api/reviews', reviewRoutes);







// app.listen(port, () => console.log(`Server started on PORT:${port}`))

server.listen(port, () => {
  console.log(`Server with Socket.IO running on http://localhost:${port}`);
});