import axios from "axios";

const api = new axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api"
});

export default api;