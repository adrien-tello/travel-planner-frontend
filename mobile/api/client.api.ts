import axios, { AxiosError } from "axios";
import { getToken } from "../utils/storage";
import { showToast } from "../utils/toast";
import { ApiError } from "./types";
import Constants from "expo-constants";

const BASE_URL =
  Constants.expoConfig?.extra?.BACKEND_ENDPOINT ||
  "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

let isRedirectingToLogin = false;

console.log("\n");
console.log("######################################");
console.log("🌐 API Base URL:", BASE_URL);
console.log("######################################");

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    console.error(`\n❌ API Error:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        showToast({
          type: "error",
          text1: "Session Expired",
          text2: "Please login again to continue",
        });

        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true;
          try {
            const { clearAuthData } = await import("../utils/storage");
            await clearAuthData();
            console.log("Auth data cleared, user should be redirected to login");
          } catch (e) {
            console.error("Error during 401 handling:", e);
          } finally {
            setTimeout(() => {
              isRedirectingToLogin = false;
            }, 500);
          }
        }
      }

      if (status === 403) {
        showToast({
          type: "error",
          text1: "Access Denied",
          text2: "You don't have permission to perform this action",
        });
      }

      if (status === 404) {
        showToast({
          type: "error",
          text1: "Not Found",
          text2: data?.message || "The requested resource was not found",
        });
      }

      if (status >= 500) {
        showToast({
          type: "error",
          text1: "Server Error",
          text2: "Something went wrong. Please try again later.",
        });
      }
    } else if (error.request) {
      console.error("⚠️ Network Error - No response received from backend");
      showToast({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection",
      });
    }

    return Promise.reject(error);
  }
);