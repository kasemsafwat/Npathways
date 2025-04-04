import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enrollment exam ID as a constant for reuse
  const ENROLLMENT_EXAM_ID = "67d48b79a192985fb050eafc";

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

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
      // If examId is provided, check for specific exam
      if (examId) {
        const exam = data.find((exam) => exam.examId === examId);
        return exam ? exam : null;
      }
      // Otherwise just check if there are any submitted exams
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error fetching submitted exams:", error);
      return null;
    }
  };

  // New function to recheck enrollment status at any time
  const recheckEnrollment = async () => {
    try {
      if (!isAuthenticated) {
        console.log("User not authenticated, can't check enrollment");
        return false;
      }

      console.log("Rechecking enrollment status...");
      const submittedExam = await checkSubmittedExam(ENROLLMENT_EXAM_ID);
      const enrollmentStatus = !!submittedExam;

      // Update the state with the new enrollment status
      setIsEnrolled(enrollmentStatus);
      console.log("Updated enrollment status:", enrollmentStatus);

      return enrollmentStatus;
    } catch (error) {
      console.error("Error rechecking enrollment:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie("access_token");
      console.log("Token:", token);

      if (token) {
        setIsAuthenticated(true);
        const submittedExam = await checkSubmittedExam(ENROLLMENT_EXAM_ID);

        if (submittedExam) {
          setIsEnrolled(true);
        } else {
          setIsEnrolled(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsEnrolled(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
    const submittedExam = await checkSubmittedExam(ENROLLMENT_EXAM_ID);
    const enrollmentStatus = !!submittedExam;
    setIsEnrolled(enrollmentStatus);
    return enrollmentStatus;
  };

  const logout = () => {
    // axios.post(
    //   "http://localhost:5024/api/auth/logout",
    //   {},
    //   { withCredentials: true }
    // );
    setIsAuthenticated(false);
    setIsEnrolled(false);
    document.cookie =
      "access_token=;expires=" + new Date(0).toUTCString() + ";path=/";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isEnrolled,
        setIsEnrolled,
        isLoading,
        checkSubmittedExam,
        recheckEnrollment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
