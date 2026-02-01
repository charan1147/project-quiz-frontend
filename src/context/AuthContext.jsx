import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/getme");
      setUser(data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.getItem("token") ? fetchUser() : setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("token", data.token);
    await fetchUser();
  };

  const register = async (u, e, p) => {
    await api.post("/auth/register", { username: u, email: e, password: p });
    await login(u, p);
  };

  const logout = () => {
    ["token", "roomId", "username"].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
