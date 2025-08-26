import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { InputField } from "../../components/auth-components/InputField";
import { loginUser, registerUser } from "../../services/authService";
import { validateAuthForm } from "../../utils/authValidation";
function AuthForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [errors, setErrors] = useState({});
  const { setUserInfo } = useAuth();
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const fields = [
    { label: "Username", name: "username", type: "text", onlyFor: "register" },
    { label: "Full Name", name: "fullName", type: "text", onlyFor: "register" },
    { label: "Email", name: "email", type: "email", onlyFor: "both" },
    { label: "Password", name: "password", type: "password", onlyFor: "both" },
  ];

  const handleInputChange = useCallback((event) => {
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
  }, []);

  const validateForm = () => {
    const newErrors = validateAuthForm(userData, isLogin);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const data = isLogin
        ? await loginUser({
            email: userData.email,
            password: userData.password,
          })
        : await registerUser(userData);

      if (data) {
        toast.success(
          isLogin ? "Login successful!" : "Registration successful!"
        );
        setUserInfo(data.data.user);
        setUserData({ username: "", fullName: "", email: "", password: "" });
        navigate("/feed/homepage");
      }
    } catch (error) {
      toast.error(
        error.message || "Invalid credentials!",
        "Something went wrong!"
      );
    }
  };

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
