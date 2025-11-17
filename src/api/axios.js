import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired AND we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/api/v1/users/refresh-token"); // hits your backend refresh route
        return api(originalRequest); // retry actual API call
      } catch (err) {
        console.log("Refresh failed. Logging out...");
        localStorage.removeItem("userInfo");
        window.location.href = "/register";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
