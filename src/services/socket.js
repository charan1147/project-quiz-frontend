import { io } from "socket.io-client";

const socket = io("https://project-quiz-backend-27.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
