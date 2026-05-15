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
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://10.43.253.148:5173',
  'https://gatcodingclubtech-source.github.io',
  'https://naseer-047.github.io',
  'https://gcc-coding-club.onrender.com'
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

// In-memory room state for real-time features
const codingRooms = new Map();
const liveRooms = new Map();

io.on('connection', (socket) => {
  // Common Room joining
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  // Collaborative Coding Hub Logic
  socket.on('join-coding-room', ({ roomId, user }) => {
    socket.join(roomId);
    if (!codingRooms.has(roomId)) {
      codingRooms.set(roomId, { 
        users: new Set(), 
        files: [
          { id: '1', name: 'main.js', content: '// Start building something elite...\n\nfunction initGCC() {\n  console.log("Welcome to the Hub");\n}\n\ninitGCC();' }
        ] 
      });
    }
    const room = codingRooms.get(roomId);
    if (room.users instanceof Set) {
        room.users.add({ ...user, socketId: socket.id });
        socket.emit('workspace-update', room.files);
        io.to(roomId).emit('room-users', Array.from(room.users));
    }
  });

  socket.on('workspace-change', ({ roomId, files }) => {
    const room = codingRooms.get(roomId);
    if (room && files) {
      room.files = files;
      socket.to(roomId).emit('workspace-update', files);
    }
  });

  socket.on('send-coding-message', ({ roomId, msg }) => {
    socket.to(roomId).emit('receive-coding-message', msg);
  });

  // Live Room Interaction Logic
  socket.on('join-live-room', ({ roomId, user, isWaiting }) => {
    socket.join(roomId);
    
    if (!liveRooms.has(roomId)) {
      liveRooms.set(roomId, { users: new Map(), messages: [] });
    }
    
    const room = liveRooms.get(roomId);

    // If the user is just waiting in the lobby, we don't add them to the active users list
    if (isWaiting) return;

    room.users.set(socket.id, { 
      ...user, 
      socketId: socket.id,
      isMuted: false,
      isVideoOff: false,
      isHandRaised: false
    });
    
    io.to(roomId).emit('room-participants', Array.from(room.users.values()));
    socket.emit('chat-history', room.messages);

    // Notify others to initiate WebRTC connection
    socket.to(roomId).emit('user-joined', { 
      socketId: socket.id, 
      user: room.users.get(socket.id) 
    });
  });

  socket.on('request-room-entry', ({ roomId, user }) => {
    // Notify the room (especially the host) that someone wants to join
    socket.to(roomId).emit('entry-request', { 
      socketId: socket.id, 
      user 
    });
  });

  socket.on('approve-room-entry', ({ roomId, targetSocketId }) => {
    // Notify the specific user that they are approved
    io.to(targetSocketId).emit('entry-approved', { roomId });
  });

  socket.on('deny-room-entry', ({ roomId, targetSocketId }) => {
    io.to(targetSocketId).emit('entry-denied', { roomId });
  });

  socket.on('call-user', ({ to, signal, from }) => {
    io.to(to).emit('call-made', { signal, from });
  });

  socket.on('answer-call', ({ to, signal }) => {
    io.to(to).emit('call-answered', { signal, from: socket.id });
  });

  socket.on('send-message', ({ roomId, message }) => {
    const room = liveRooms.get(roomId);
    if (room) {
      const chatMsg = {
        ...message,
        id: Date.now(),
        timestamp: new Date()
      };
      room.messages.push(chatMsg);
      io.to(roomId).emit('new-message', chatMsg);
    }
  });

  socket.on('toggle-media', ({ roomId, type, value }) => {
    const room = liveRooms.get(roomId);
    if (room && room.users.has(socket.id)) {
      const user = room.users.get(socket.id);
      if (type === 'audio') user.isMuted = value;
      if (type === 'video') user.isVideoOff = value;
      io.to(roomId).emit('room-participants', Array.from(room.users.values()));
    }
  });

  socket.on('raise-hand', ({ roomId, isRaised }) => {
    const room = liveRooms.get(roomId);
    if (room && room.users.has(socket.id)) {
      room.users.get(socket.id).isHandRaised = isRaised;
      io.to(roomId).emit('room-participants', Array.from(room.users.values()));
    }
  });

  socket.on('send-reaction', ({ roomId, emoji }) => {
    io.to(roomId).emit('new-reaction', { socketId: socket.id, emoji });
  });

  socket.on('leave-live-room', (roomId) => {
    socket.leave(roomId);
    const room = liveRooms.get(roomId);
    if (room) {
      room.users.delete(socket.id);
      io.to(roomId).emit('room-participants', Array.from(room.users.values()));
      io.to(roomId).emit('user-left', socket.id);
    }
  });

  // Native WebRTC Signaling Logic
  socket.on('webrtc-signal', ({ to, from, signal }) => {
    io.to(to).emit('webrtc-signal', { signal, from });
  });

  socket.on('disconnect', () => {
    // Cleanup Coding Rooms
    codingRooms.forEach((room, roomId) => {
      const updatedUsers = Array.from(room.users).filter(u => u.socketId !== socket.id);
      if (updatedUsers.length !== Array.from(room.users).length) {
        room.users = new Set(updatedUsers);
        io.to(roomId).emit('room-users', updatedUsers);
      }
    });

    // Cleanup Live Rooms
    liveRooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        io.to(roomId).emit('room-participants', Array.from(room.users.values()));
        io.to(roomId).emit('user-left', socket.id);
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
