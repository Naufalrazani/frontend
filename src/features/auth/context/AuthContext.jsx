import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  login as authLogin,
  logout as authLogout,
  registerUser as authRegister,
  getProfile,
  isAuthenticated,
} from "../services/authService";

const AuthContext = createContext(undefined);

const initialState = {
  user: null,
  isLoggedIn: isAuthenticated(),
  isLoading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const loadUser = useCallback(async () => {
    if (isAuthenticated()) {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const profile = await getProfile();
        setState((prevState) => ({
          ...prevState,
          user: profile,
          isLoggedIn: true,
          isLoading: false,
          error: null,
        }));
      } catch (err) {
        console.error(
          "Failed to load user profile. Invalid token or server error.",
          err
        );

        await authLogout();
        setState((prevState) => ({
          ...prevState,
          user: null,
          isLoggedIn: false,
          isLoading: false,
          error: "Sesi kedaluwarsa. Silakan login kembali.",
        }));
      }
    } else {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogin = async (email, password) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
    try {
      await authLogin(email, password);

      const profile = await getProfile();

      setState((prevState) => ({
        ...prevState,
        user: profile,
        isLoggedIn: true,
        isLoading: false,
      }));
      return profile;
    } catch (err) {
      await authLogout();

      setState((prevState) => ({
        ...prevState,
        user: null,
        error:
          err.response?.data?.message ||
          err.message ||
          "Login gagal. Periksa kredensial Anda.",
        isLoggedIn: false,
        isLoading: false,
      }));
      throw err.response?.data || err;
    }
  };

  const handleLogout = async () => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
    try {
      await authLogout();
    } catch (err) {
      console.error("Error during server logout, tokens cleared locally.", err);
    } finally {
      setState((prevState) => ({
        ...prevState,
        user: null,
        isLoggedIn: false,
        isLoading: false,
      }));
    }
  };

  const handleRegister = async (userData) => {
    setState((prevState) => ({ ...prevState, error: null }));
    try {
      const result = await authRegister(userData);
      return result;
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error:
          err.response?.data?.message || err.message || "Pendaftaran gagal.",
      }));
      throw err.response?.data || err;
    }
  };

  const clearError = () =>
    setState((prevState) => ({ ...prevState, error: null }));

  const value = {
    ...state,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    clearError: clearError,
    setUser: (newUserData) =>
      setState((prevState) => ({ ...prevState, user: newUserData })),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
