import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { InputField } from "../../components/auth-components/InputField";
function AuthForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUserInfo } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (name === "email" && /\S+@\S+\.\S+/.test(value)) {
        delete updatedErrors.email;
      }
      if (name === "username" && value.trim()) {
        delete updatedErrors.username;
      }
      if (name === "fullName" && value.trim()) {
        delete updatedErrors.fullName;
      }
      if (name === "password" && value.length >= 6) {
        delete updatedErrors.password;
      }

      return updatedErrors;
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!isLogin && !userData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!isLogin && !userData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    console.log("Form submitted with:", userData);
    const endpoint = isLogin
      ? "http://localhost:4000/api/v1/users/login"
      : "http://localhost:4000/api/v1/users/register";

    const payload = isLogin
      ? {
          email: userData.email,
          password: userData.password,
        }
      : userData;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      console.log("API Response:", data);

      setUserData({ username: "", fullName: "", email: "", password: "" });

      if (res.ok) {
        toast.success(
          isLogin ? "Login successful!" : "Registration successful!"
        );
        setUserInfo(data.data.user);
        navigate("/feed/homepage");
      } else {
        toast.error(data.message || "Invalid credentials!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const fields = [
    { label: "Username", name: "username", type: "text", onlyFor: "register" },
    { label: "Full Name", name: "fullName", type: "text", onlyFor: "register" },
    { label: "Email", name: "email", type: "email", onlyFor: "both" },
    { label: "Password", name: "password", type: "password", onlyFor: "both" },
  ];

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md space-y-4 p-6 bg-slate-800 text-gray-100 rounded-lg shadow-md"
      >
        <h1 className="font-bold text-xl">{isLogin ? "Login" : "Register"}</h1>

        {fields
          .filter(
            (field) =>
              field.onlyFor === "both" ||
              (isLogin && field.onlyFor === "login") ||
              (!isLogin && field.onlyFor === "register")
          )
          .map((field) => (
            <InputField
              key={field.name}
              {...field}
              value={userData[field.name]}
              onChange={handleInputChange}
              error={errors[field.name]}
            />
          ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {/* Toggle Link */}
        <p className="text-sm text-center text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
