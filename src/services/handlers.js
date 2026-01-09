import axiosInstance from "./api";
import { API_URLS } from "@/constants/apiUrls";

export const getAllEvents = async () => {
  const response = await axiosInstance.get(API_URLS.events);
  return response.data;
}