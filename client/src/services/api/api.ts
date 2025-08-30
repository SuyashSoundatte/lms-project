import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, Method } from "axios";

export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  VERSION: import.meta.env.VITE_API_VERSION || "api/v1",
};

export const METHOD = {
  GET: "GET" as Method,
  POST: "POST" as Method,
  PUT: "PUT" as Method,
  PATCH: "PATCH" as Method,
  DELETE: "DELETE" as Method,
};

export interface ApiResponse<T = any> {
  statuscode: number;
  data: T;
  message: string;
  status: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: `${API.BASE_URL}${API.VERSION}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

interface ApiRequestOptions<TData = Record<string, any> | FormData> {
  method: Method;
  url: string;
  data?: TData;
  params?: Record<string, any>; // ✅ Added support for query parameters
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
}

export const apiRequest = async <T = any>({
  method,
  url,
  data,
  params,
  requiresAuth = false,
  customHeaders = {},
}: ApiRequestOptions): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = { ...customHeaders };

    if (requiresAuth) {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found. Please login again.");
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (data instanceof FormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      params,
    };

    // ✅ Only attach data for appropriate methods
    if (data && ["POST", "PUT", "PATCH"].includes(method)) {
      config.data = data;
    }

    const response = await api.request<ApiResponse<T>>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "API Request Failed.";
      throw new Error(message);
    } else {
      throw new Error("An unexpected error occurred while API fetching");
    }
  }
};
