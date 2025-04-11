import React, { createContext, useState } from "react";
export const EnrollmentContext = createContext();
export const EnrollmentProvider = ({ children }) => {
  const [personalDetails, setPersonalDetails] = useState({});
  const [examAnswers, setExamAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const enrollmentData = {
    ...personalDetails,
    exam: examAnswers,
  };
  // handleSetStep() {
  //   if (step === 4) return;
  //   setStep((prevStep) => prevStep + 1);
  // }
  return (
    <EnrollmentContext.Provider
      value={{
        personalDetails,
        setPersonalDetails,
        examAnswers,
        setExamAnswers,
        enrollmentData,
        step,
        setStep,
        error,
        setError,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};
