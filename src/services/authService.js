import api from "../api/axios";

export const loginUser = async (payload) => {
  try {
    const res = await api.post("/api/v1/users/login", payload);

    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (payload) => {
  try {
    const res = await api.post("/api/v1/users/register", payload);

    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
