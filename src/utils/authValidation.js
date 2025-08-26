export const validateAuthForm = (userData, isLogin) => {
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
  return newErrors;
};
