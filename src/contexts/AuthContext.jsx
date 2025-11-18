import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../socket";
import api from "../api/axios";
export const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

// export const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(() => {
//     const stored = localStorage.getItem("userInfo");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [notifications, setNotifications] = useState([]);
//   const [isReady, setIsReady] = useState(false); // ensures we wait for auth check

//   // ✅ Helper — sync localStorage + state
//   const updateUserInfo = (info) => {
//     setUserInfo(info);
//     if (info) {
//       localStorage.setItem("userInfo", JSON.stringify(info));
//     } else {
//       localStorage.removeItem("userInfo");
//     }
//   };

//   // ✅ Step 1: Verify session on mount
//   // useEffect(() => {
//   //   const verifyUser = async () => {
//   //     try {
//   //       const res = await axios.get(
//   //         "http://localhost:4000/api/v1/users/profile",
//   //         {
//   //           withCredentials: true,
//   //         }
//   //       );

//   //       if (res.data?.data?.user) {
//   //         setUserInfo(res.data.data.user);
//   //         localStorage.setItem("userInfo", JSON.stringify(res.data.data.user));
//   //         console.log(
//   //           "✅ Session restored for user:",
//   //           res.data.data.user.username
//   //         );
//   //       }
//   //     } catch (err) {
//   //       console.log("⚠️ No active session:", err.message);
//   //       setUserInfo(null);
//   //       localStorage.removeItem("userInfo");
//   //     } finally {
//   //       setIsReady(true);
//   //     }
//   //   };

//   //   verifyUser();
//   // }, []);

//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         const res = await api.get("/api/v1/users/profile");

//         if (res.data?.data?.user) {
//           updateUserInfo(res.data.data.user);
//           console.log(
//             "✅ Session restored for user:",
//             res.data.data.user.username
//           );
//         } else {
//           updateUserInfo(null);
//         }
//       } catch (err) {
//         console.log("⚠️ No active session:", err.message);
//         updateUserInfo(null);
//       } finally {
//         setIsReady(true); // mark that verification is done
//       }
//     };

//     verifyUser();
//   }, []);

//   // ✅ Step 2: Fetch existing notifications after login
//   useEffect(() => {
//     if (!isReady || !userInfo?._id) return;

//     const fetchNotifications = async () => {
//       try {
//         const res = await api.get("/api/v1/users/notifications/all");
//         setNotifications(res.data.data || []);
//         console.log("📬 Notifications loaded:", res.data.data?.length);
//       } catch (err) {
//         console.log("❌ Failed to fetch notifications:", err.message);
//       }
//     };

//     fetchNotifications();
//   }, [userInfo, isReady]);

//   // ✅ Step 3: Handle socket connection & live notifications
//   useEffect(() => {
//     if (!userInfo?._id) return;

//     // 🟢 Join instantly if we already have userI nfo (e.g. from localStorage)
//     socket.emit("join", userInfo._id);
//     console.log("🔌 Joined room instantly:", userInfo._id);

//     // Rejoin after verification if needed
//     const handleConnect = () => {
//       socket.emit("join", userInfo._id);
//       console.log("🔁 Socket reconnected and joined:", userInfo._id);
//     };

//     socket.on("connect", handleConnect);

//     // 🎯 Listen for all types of real-time notifications
//     socket.on("newNotification", (data) => {
//       setNotifications((prev) => [
//         {
//           message: `${data.sender} uploaded: ${data.videoTitle}`,
//           videoId: data.videoId,
//           thumbnail: data.thumbnail,
//           timestamp: new Date(),
//         },
//         ...prev,
//       ]);
//     });

//     // Cleanup on unmount or logout
//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("newNotification");
//       if (userInfo?._id) socket.emit("leave", userInfo._id);
//     };
//   }, [userInfo]);

//   return (
//     <AuthContext.Provider
//       value={{
//         userInfo,
//         setUserInfo: updateUserInfo,
//         notifications,
//         setNotifications,
//         isReady,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(() => {
//     const stored = localStorage.getItem("userInfo");
//     return stored ? JSON.parse(stored) : null;
//   });
//   const [isReady, setIsReady] = useState(false); // indicates session check done

//   const updateUserInfo = (info) => {
//     setUserInfo(info);
//     if (info) {
//       localStorage.setItem("userInfo", JSON.stringify(info));
//     } else {
//       localStorage.removeItem("userInfo");
//     }
//   };

//   // verify session on mount
//   useEffect(() => {
//     const verifyUser = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:4000/api/v1/users/profile",
//           { withCredentials: true }
//         );
//         if (res.data?.data?.user) {
//           updateUserInfo(res.data.data.user);
//           console.log("✅ Session restored:", res.data.data.user.username);
//         } else {
//           updateUserInfo(null);
//         }
//       } catch (err) {
//         console.log("⚠️ No active session:", err.message);
//         updateUserInfo(null);
//       } finally {
//         setIsReady(true);
//       }
//     };

//     verifyUser();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ userInfo, setUserInfo: updateUserInfo, isReady }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const AuthProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(() => {
//     const stored = localStorage.getItem("userInfo");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [notifications, setNotifications] = useState([]);
//   const [isReady, setIsReady] = useState(false);

//   // Sync state + localStorage
//   const updateUserInfo = (info) => {
//     setUserInfo(info);
//     if (info) {
//       localStorage.setItem("userInfo", JSON.stringify(info));
//     } else {
//       localStorage.removeItem("userInfo");
//     }
//   };

//   // 1️⃣ Session Restore Logic
//   useEffect(() => {
//     // If user already present in localStorage → skip backend check
//     if (userInfo) {
//       setIsReady(true);
//       return;
//     }

//     const restoreSession = async () => {
//       try {
//         const res = await api.get("/api/v1/users/profile");

//         if (res.data?.data?.user) {
//           updateUserInfo(res.data.data.user);
//           console.log("Session restored:", res.data.data.username);
//         } else {
//           updateUserInfo(null);
//         }
//       } catch (err) {
//         console.log("No active session:", err.message);
//         updateUserInfo(null);
//       } finally {
//         setIsReady(true);
//       }
//     };

//     restoreSession();
//   }, []);

//   // 2️⃣ Fetch Notifications After User Load
//   useEffect(() => {
//     if (!isReady || !userInfo?._id) return;

//     const fetchNotifications = async () => {
//       try {
//         const res = await api.get("/api/v1/users/notifications/all");
//         setNotifications(res.data.data || []);
//         console.log("Notifications loaded:", res.data.data?.length);
//       } catch (err) {
//         console.log("Failed to fetch notifications:", err.message);
//       }
//     };

//     fetchNotifications();
//   }, [userInfo, isReady]);

//   // 3️⃣ Handle Socket Connections for Logged-in Users
//   useEffect(() => {
//     if (!userInfo?._id) return;

//     socket.emit("join", userInfo._id);
//     console.log("Joined socket room:", userInfo._id);

//     const handleConnect = () => {
//       socket.emit("join", userInfo._id);
//       console.log("Reconnected & rejoined:", userInfo._id);
//     };

//     socket.on("connect", handleConnect);

//     socket.on("newNotification", (data) => {
//       setNotifications((prev) => [
//         {
//           message: `${data.sender} uploaded: ${data.videoTitle}`,
//           videoId: data.videoId,
//           thumbnail: data.thumbnail,
//           timestamp: new Date(),
//         },
//         ...prev,
//       ]);
//     });

//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("newNotification");
//       socket.emit("leave", userInfo._id);
//     };
//   }, [userInfo]);

//   return (
//     <AuthContext.Provider
//       value={{
//         userInfo,
//         setUserInfo: updateUserInfo,
//         notifications,
//         setNotifications,
//         isReady,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// ✅ CLEAN + FLICKER-FREE AUTH PROVIDER

export const AuthProvider = ({ children }) => {
  // ---- 1) Load from LocalStorage immediately (synchronous) ----
  const stored = localStorage.getItem("userInfo");
  const initialUser = stored ? JSON.parse(stored) : null;

  const [userInfo, setUserInfo] = useState(initialUser);

  // If userInfo exists → we’re already "ready"
  const [isReady, setIsReady] = useState(!!initialUser);

  const [notifications, setNotifications] = useState([]);

  // ---- Helper: update LS + state ----
  const updateUserInfo = (info) => {
    setUserInfo(info);

    if (info) {
      localStorage.setItem("userInfo", JSON.stringify(info));
    } else {
      localStorage.removeItem("userInfo");
    }
  };

  // ---- 2) If NO local user → try session restore ----
  useEffect(() => {
    if (initialUser) return; // user already known → no restore needed

    const restoreSession = async () => {
      try {
        const res = await api.get("/api/v1/users/profile");

        if (res.data?.data?.user) {
          updateUserInfo(res.data.data.user);
        } else {
          updateUserInfo(null);
        }
      } catch (err) {
        updateUserInfo(null);
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, []);

  // ---- 3) Fetch notifications *after* user is loaded & ready ----
  useEffect(() => {
    if (!isReady || !userInfo?._id) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/v1/users/notifications/all");
        setNotifications(res.data.data || []);
      } catch (err) {
        console.log("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [isReady, userInfo]);

  // ---- 4) Socket handling ----
  useEffect(() => {
    if (!userInfo?._id) return;

    socket.emit("join", userInfo._id);

    const handleConnect = () => {
      socket.emit("join", userInfo._id);
    };

    socket.on("connect", handleConnect);

    socket.on("newNotification", (data) => {
      setNotifications((prev) => [
        {
          message: `${data.sender} uploaded: ${data.videoTitle}`,
          videoId: data.videoId,
          thumbnail: data.thumbnail,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newNotification");
      socket.emit("leave", userInfo._id);
    };
  }, [userInfo]);

  // ---- 5) Provider Context ----
  return (
    <AuthContext.Provider
      value={{
        userInfo,
        setUserInfo: updateUserInfo,
        notifications,
        setNotifications,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
