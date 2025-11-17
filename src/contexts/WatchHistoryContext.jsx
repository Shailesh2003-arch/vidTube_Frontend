import {
  useEffect,
  useCallback,
  useContext,
  createContext,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import api from "../api/axios";
const WatchHistoryContext = createContext();

export function WatchHistoryProvider({ children }) {
  const { userInfo, isReady } = useAuth();
  const [history, setHistory] = useState(() => {
    try {
      const raw = sessionStorage.getItem("watch_history");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(history === null);
  const [error, setError] = useState(null);

  // ⭐ Rewritten to use api.get (no BASE_URL)
  const fetchWatchHistory = useCallback(async () => {
    if (!userInfo?._id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/users/watch-history");

      const data = res?.data?.data || [];
      setHistory(data);

      try {
        sessionStorage.setItem("watch_history", JSON.stringify(data));
      } catch {}
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userInfo?._id]);

  // 🔁 Fetch on login & initial resolve
  useEffect(() => {
    if (!isReady) return;
    if (!userInfo?._id) return;

    fetchWatchHistory();
  }, [userInfo, isReady, fetchWatchHistory]);

  // ⭐ Mutate-local-history (no API call needed)
  const addToHistory = (entry) => {
    setHistory((prev = []) => {
      const filtered = prev.filter((i) => i.video?._id !== entry.video?._id);
      const updated = [entry, ...filtered];

      try {
        sessionStorage.setItem("watch_history", JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  return (
    <WatchHistoryContext.Provider
      value={{
        history: history || [],
        loading,
        error,
        refreshHistory: fetchWatchHistory,
        addToHistory,
        setHistory,
      }}
    >
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  const ctx = useContext(WatchHistoryContext);
  if (!ctx) {
    throw new Error("useWatchHistory must be used inside WatchHistoryProvider");
  }
  return ctx;
}
