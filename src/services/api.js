// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: 'https://project-quiz-backend-23.onrender.com/api',
  withCredentials: true, 
});

export default api;

