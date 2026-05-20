import { createContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authApi.getMe();
          // response is ApiResponse { success, message, data: user }
          setUser(response.data || response);
        } catch (error) {
          console.error("Error fetching session information:", error);
          localStorage.removeItem("accessToken");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const response = await authApi.login({ username, password });
    // response is ApiResponse { success, message, data: { accessToken, user } }
    const accessToken = response.data.accessToken;
    const userData = response.data.user;

    localStorage.setItem("accessToken", accessToken);

    setUser(userData);

    return userData;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Error calling API logout:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
