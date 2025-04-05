import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verify user authentication on component mount
  useEffect(() => {
    verifyAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5024/api/auth/login",
        credentials
      );

      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await axios.delete("http://localhost:5024/api/auth/logout");
      setIsAuthenticated(false);
      setUser(null);
      setIsEnrolled(false);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify authentication status
  const verifyAuth = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5024/api/auth/verify");

      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        verifyAuth,
        isEnrolled,
        setIsEnrolled,
        isLoading,
        // checkSubmittedExam,
        // recheckEnrollment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
