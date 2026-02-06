// src/api/client.ts (or similar)
import axios from 'axios';

// 1. Define the Base URL for your Express backend
const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'; 

// 2. Create an instance with crucial configuration
const client = axios.create({
  baseURL: BASE_URL,
  // CRITICAL: Tells the browser/Axios to include cookies with requests.
  withCredentials: true, 
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

export default client;