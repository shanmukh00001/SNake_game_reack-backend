import axios from "axios";

const API = axios.create({
  baseURL: (() => {
    const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    let url = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
    if (!url.endsWith("/api")) {
      url = `${url}/api`;
    }
    return `${url}/`;
  })(),
});

API.interceptors.request.use((req) => {
  if (typeof localStorage !== "undefined") {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // Ignore
    }
  }
  return req;
});

export default API;
