// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If token expired AND we haven't retried this request yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await api.post("/api/v1/users/refresh-token"); // hits your backend refresh route
//         return api(originalRequest); // retry actual API call
//       } catch (err) {
//         console.log("Refresh failed. Logging out...");
//         localStorage.removeItem("userInfo");
//         window.location.href = "/register";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.request));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired:
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // THIS IS THE FIX 👇
        console.log(`Making request to refresh token endpoint`);
        await api.post(
          "/api/v1/users/refresh-token",
          {},
          { withCredentials: true } // MUST EXPLICITLY PASS
        );

        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.log("Refresh token failed. Logging out...");
        localStorage.removeItem("userInfo");
        window.location.href = "/register";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
