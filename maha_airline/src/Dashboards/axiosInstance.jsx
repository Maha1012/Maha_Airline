import axios from 'axios';

// Retrieve the API path from localStorage or set a default value
const apiPath = localStorage.getItem('apipath') || 'http://192.168.10.52:90/api/';

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: apiPath,
});

export default axiosInstance;
