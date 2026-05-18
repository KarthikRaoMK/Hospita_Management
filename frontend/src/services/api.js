import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Assuming backend runs on 8080
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
