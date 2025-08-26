const API_BASE = `http://localhost:4000/api/v1/users`;

export const loginUser = async (payload) => {
  console.log(payload);
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("API Response:", data);

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

export const registerUser = async (payload) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await res.json();
  console.log("API Response:", data);
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};
