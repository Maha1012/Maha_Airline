// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7124/api/', // Replace with your base API URL
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('Token')}`, // Get the token from localStorage
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
