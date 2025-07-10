import axios from "axios";

const api = axios.create({
  baseURL: 'https://project-quiz-backend-20.onrender.com/api',
  withCredentials: true, 
});

export default api;
