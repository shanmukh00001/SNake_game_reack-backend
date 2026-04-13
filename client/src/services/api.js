import axios from "axios";

const API = axios.create({
  baseURL: (() => {
    let url = import.meta.env.VITE_API_URL || "";
    console.log(import.meta.env.VITE_API_URL);
    if (!url.includes("/api")) {
      url = url.endsWith("/") ? `${url}api` : `${url}/api`;
      
    }
    return url.endsWith("/") ? url : `${url}/`;
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