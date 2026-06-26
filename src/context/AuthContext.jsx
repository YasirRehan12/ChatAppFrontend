import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("chatapp-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validate token on app load
  useEffect(() => {
    const token = localStorage.getItem("chatapp-token");
    if (!token) {
      setLoading(false);
      return;
    }
    axiosInstance
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("chatapp-user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("chatapp-token");
        localStorage.removeItem("chatapp-user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("chatapp-token", data.token);
    localStorage.setItem("chatapp-user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const registerWithEmail = async (name, email, password) => {
    const { data } = await axiosInstance.post("/auth/register", { name, email, password });
    persistSession(data);
    return data.user;
  };

  const loginWithEmail = async (email, password) => {
    const { data } = await axiosInstance.post("/auth/login", { email, password });
    persistSession(data);
    return data.user;
  };

  const loginWithGoogle = async (idToken) => {
    const { data } = await axiosInstance.post("/auth/google", { idToken });
    persistSession(data);
    return data.user;
  };

  const sendPhoneOtp = async (phone) => {
    await axiosInstance.post("/auth/phone/send-otp", { phone });
  };

  const verifyPhoneOtp = async (phone, code, name) => {
    const { data } = await axiosInstance.post("/auth/phone/verify-otp", { phone, code, name });
    persistSession(data);
    return data.user;
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem("chatapp-token");
    localStorage.removeItem("chatapp-user");
    setUser(null);
    toast.success("Logged out");
  };

  const updateUserInContext = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("chatapp-user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerWithEmail,
        loginWithEmail,
        loginWithGoogle,
        sendPhoneOtp,
        verifyPhoneOtp,
        logout,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
