import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_ENDPOINT,
});

export default axiosInstance;