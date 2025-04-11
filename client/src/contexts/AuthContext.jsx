import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

axios.defaults.withCredentials = true;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const navigate = useNavigate();

  // Verify user authentication on component mount
  useEffect(() => {
    verifyAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    let response;
    try {
      setIsLoading(true);
      response = await axios.post(
        "http://localhost:5024/api/login",
        credentials
      );

      if (response.data.userId) {
        setIsAuthenticated(true);
        setIsStudent(true);
        setUser(response.data);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("email", response.data.email);
        navigate("/student/mypathway");

        return { success: true, data: response.data };
      }
      if (response.data.instructorID) {
        setIsAuthenticated(true);
        setIsInstructor(true);
        setUser(response.data);
        localStorage.setItem("instructorID", response.data.instructorID);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("email", response.data.email);
        navigate("/instructor/dashboard");
        return { success: true, data: response.data };
      }
    } catch (error) {
      // console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
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
      setIsStudent(false);
      setIsInstructor(false);
      setUser(null);
      setIsEnrolled(false);
      localStorage.clear();
      navigate("/login");
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
      // const response = await axios.get("http://localhost:5024/api/auth/verify");
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await axios.get(
          `http://localhost:5024/api/user/${userId}`,
          { withCredentials: true }
        );
        const enrolledCourses = response.data.pathways;
        setIsEnrolled(enrolledCourses.length > 0);
        setIsStudent(true);
        setIsAuthenticated(true);
        console.log(response.data);
        setUser(response.data);
      }
      const instructorId = localStorage.getItem("instructorID");
      if (instructorId) {
        const response = await axios.get(
          `http://localhost:5024/api/instructor/`,
          { withCredentials: true }
        );
        setIsInstructor(true);
        setIsAuthenticated(true);
        setUser(response.data);
      } else if (!userId && !instructorId) {
        setIsAuthenticated(false);
        setUser(null);
      }

      // if (response.data) {
      //   setIsAuthenticated(true);
      //   setUser(response.data);
      // } else {
      //   setIsAuthenticated(false);
      //   setUser(null);
      // }
    } catch (error) {
      // console.error("Verification error:", error);
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
        isStudent,
        isInstructor,
        // checkSubmittedExam,
        // recheckEnrollment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
