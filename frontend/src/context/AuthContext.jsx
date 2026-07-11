import { createContext, useEffect, useState } from "react";
import { getUser, clearUser } from "../utils/storage";
import { logout as logoutService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserState(getUser());
    setLoading(false);
  }, []);

  const login = (userData) => setUserState(userData);

  const logout = () => {
    logoutService();
    clearUser();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
