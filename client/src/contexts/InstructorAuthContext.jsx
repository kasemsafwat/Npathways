import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const InstructorAuthContext = createContext();

export const InstructorAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify user authentication on component mount
  // useEffect(() => {
  //   verifyAuth();
  // }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5024/api/login",
        credentials
      );

      if (response.data) {
        setIsAuthenticated(true);
        setUser(response.data);
        localStorage.setItem("instructorID", response.data.instructorID);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("email", response.data.email);
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
      await axios.delete("http://localhost:5024/api/instructor/logout");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.clear();
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.response?.data || error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify authentication status
  // const verifyAuth = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(
  //       "http://localhost:5024/api/instructor/verify"
  //     );

  //     if (response.data) {
  //       setIsAuthenticated(true);
  //       setUser(response.data);
  //     } else {
  //       setIsAuthenticated(false);
  //       setUser(null);
  //     }
  //   } catch (error) {
  //     // console.error("Verification error:", error);
  //     setIsAuthenticated(false);
  //     setUser(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <InstructorAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        // verifyAuth,
        isLoading,
      }}
    >
      {children}
    </InstructorAuthContext.Provider>
  );
};
