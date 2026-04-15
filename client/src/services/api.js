import axios from "axios";

const API = axios.create({
  baseURL: (() => {
    // 1. Get base URL from environment (Vite picks .env.local for dev, .env.production for production)
    const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    // 2. Normalize: Remove trailing slash if provided in ENV
    let url = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
    
    // 3. Ensure /api suffix exists exactly once (requirement)
    if (!url.endsWith("/api")) {
      url = `${url}/api`;
    }
    
    // 4. Verification log
    console.log(`🚀 [API Service]: Target Backend -> ${url}`);
    
    return `${url}/`;
  })(),
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

export default API;