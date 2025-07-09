import { io } from 'socket.io-client';

const socket = io('https://project-quiz-backend-14.onrender.com', {
  withCredentials: true,
  transports: ['websocket'], 
});


export default socket;