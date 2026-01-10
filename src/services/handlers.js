import axiosInstance from "./api";
import { API_URLS } from "@/constants/apiUrls";

export const getAllEvents = async () => {
  const response = await axiosInstance.get(API_URLS.events);
  return response.data;
}

export const sendOtp = async (phone) => {
  const response = await axiosInstance.post(API_URLS.sendOtp, {
    phone,
  });
  return response.data;
};

export const verifyOtpApi = async (payload) => {
  const response = await axiosInstance.post(API_URLS.verifyOtp, payload);
  return response.data;
};

export const createOrderApi = async (payload) => {
  const response = await axiosInstance.post(API_URLS.createOrder, payload);
  return response.data;
};