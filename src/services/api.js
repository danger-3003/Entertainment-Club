import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://vishwanadhbackend.vercel.app/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

export default axiosInstance;