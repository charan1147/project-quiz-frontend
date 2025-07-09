import axios from "axios";

const api = axios.create({
  baseURL: 'https://project-quiz-backend-11.onrender.com/api',
  withCredentials: true, 
});

export default api;
