import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  useEffect(() => {
    const checkSubmittedExam = async (examId) => {
      try {
        const token = getCookie("access_token");
        if (!token) {
          console.error("No access token found");
          return null;
        }

        const response = await axios.get(
          `http://localhost:5024/api/exam/submittedExams`,
          { withCredentials: true }
        );
        const data = response.data;
        const exam = data.find((exam) => exam.examId === examId);
        return exam ? exam : null;
      } catch (error) {
        console.error("Error fetching submitted exams:", error);
        return null;
      }
    };
    console.log("Running useEffect to check cookies");
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      console.log("All cookies:", value);
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };
    const token = getCookie("access_token");
    console.log("Token:", token);
    if (token) {
      setIsAuthenticated(true);
      if (checkSubmittedExam("67d48b79a192985fb050eafc")) {
        setIsEnrolled(true);
      }
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    document.cookie =
      "access_token=;expires=" + new Date(0).toUTCString() + ";path=/";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isEnrolled }}
    >
      {children}
    </AuthContext.Provider>
  );
};
