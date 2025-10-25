import axios from 'axios'
axios.defaults.withCredentials = true;
const BASE_URL = 'http://localhost:5000/api'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// ✅ Add interceptor once — automatically adds JWT from cookies
axiosInstance.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});