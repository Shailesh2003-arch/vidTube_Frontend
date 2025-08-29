import { createContext, useContext, useState } from "react";
// import { socket } from "../socket";

export const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  // 2. Helper to update state AND localStorage
  const updateUserInfo = (info) => {
    setUserInfo(info);
    if (info) {
      localStorage.setItem("userInfo", JSON.stringify(info));
    } else {
      localStorage.removeItem("userInfo"); // logout case
    }
  };

  // const [notifications, setNotifications] = useState([]);
  // useEffect(() => {
  //   if (userInfo?._id) {
  //     socket.emit("join", userInfo._id);

  //     socket.on("notification", (data) => {
  //       setNotifications((prev) => [data, ...prev]);
  //     });
  //   }

  //   return () => {
  //     socket.off("notification"); // cleanup
  //   };
  // }, [userInfo]);

  return (
    <AuthContext.Provider
      value={{ userInfo, setUserInfo: updateUserInfo /*notifications*/ }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
