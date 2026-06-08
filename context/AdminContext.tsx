import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const ADMIN_KEY = "@govtjobalert/admin_logged_in";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

interface AdminContextValue {
  isAdmin: boolean;
  loginLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(ADMIN_KEY).then((val) => {
      if (val === "true") setIsAdmin(true);
      setLoginLoading(false);
    });
  }, []);

  const login = async (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      await AsyncStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loginLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
