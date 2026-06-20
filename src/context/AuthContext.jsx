import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const response = await client.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.access_token);

    const meResponse = await client.get("/auth/me");
    setUser(meResponse.data);
  }

  async function register(email, password) {
    await client.post("/auth/register", {
      email,
      password,
    });

    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await client.get("/auth/me");
        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}