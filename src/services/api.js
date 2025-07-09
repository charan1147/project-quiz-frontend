import axios from "axios";

const api = axios.create({
  baseURL: 'https://project-quiz-backend-15.onrender.com/api',
  withCredentials: true, 
});

export default api;
