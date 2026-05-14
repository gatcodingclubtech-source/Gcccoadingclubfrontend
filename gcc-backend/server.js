require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// Passport config
require('./config/passport');

// Connect to Database
connectDB();

const app = express();

// Trust proxy for Render/Cloudflare
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://gatcodingclubtech-source.github.io',
  'https://naseer-047.github.io'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Session for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'gcc_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/quiz-sessions', require('./routes/quizSessions'));
app.use('/api/domains', require('./routes/domains'));
app.use('/api/discussions', require('./routes/discussions'));
app.use('/api/live-rooms', require('./routes/liveRooms'));

// Root route
app.get('/', (req, res) => {
  res.send('GCC API is running...');
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const socketService = require('./utils/socketService');
socketService.init(io);

// In-memory room state for real-time features (in a real startup, use Redis)
const codingRooms = new Map();

io.on('connection', (socket) => {
  // Room joining and other listeners that don't need service abstraction yet
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  // Collaborative Coding Hub Logic
  socket.on('join-coding-room', ({ roomId, user }) => {
    socket.join(roomId);
    if (!codingRooms.has(roomId)) {
      codingRooms.set(roomId, { users: new Set(), code: '// Start building...' });
    }
    const room = codingRooms.get(roomId);
    room.users.add({ ...user, socketId: socket.id });
    socket.emit('code-update', room.code);
    io.to(roomId).emit('room-users', Array.from(room.users));
  });

  socket.on('code-change', ({ roomId, code }) => {
    const room = codingRooms.get(roomId);
    if (room) {
      room.code = code;
      socket.to(roomId).emit('code-update', code);
    }
  });

  // WebRTC Signaling Logic
  socket.on('offer', (data) => {
    socket.to(data.target).emit('offer', { offer: data.offer, sender: socket.id });
  });

  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', { answer: data.answer, sender: socket.id });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', { candidate: data.candidate, sender: socket.id });
  });

  socket.on('disconnect', () => {
    codingRooms.forEach((room, roomId) => {
      const updatedUsers = Array.from(room.users).filter(u => u.socketId !== socket.id);
      if (updatedUsers.length !== Array.from(room.users).length) {
        room.users = new Set(updatedUsers);
        io.to(roomId).emit('room-users', updatedUsers);
      }
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 Elite GCC Server running on port ${PORT}`);
});
