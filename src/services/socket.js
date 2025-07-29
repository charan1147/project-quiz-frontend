import { io } from "socket.io-client";

const socket = io("https://project-quiz-socket.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
