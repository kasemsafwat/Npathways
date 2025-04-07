import React, { createContext, useState } from "react";
export const EnrollmentContext = createContext();
export const EnrollmentProvider = ({ children }) => {
  const [personalDetails, setPersonalDetails] = useState({});
  const [examAnswers, setExamAnswers] = useState([]); 
  const [error, setError] = useState(null);

  const enrollmentData = {
    ...personalDetails,
    exam: examAnswers,
  };

  return (
    <EnrollmentContext.Provider
      value={{
        personalDetails,
        setPersonalDetails,
        examAnswers,
        setExamAnswers,
        enrollmentData,
        error,
        setError,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};