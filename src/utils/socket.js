import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PROD 
  ? 'https://gcc-backend-api.onrender.com' 
  : (import.meta.env.VITE_API_URL || 'http://10.43.253.148:5001');

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
