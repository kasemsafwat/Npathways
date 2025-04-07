// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ExamPage from "./Components/ExamPage/ExamPage";
import CreateExam from "./Components/CreateExam/CreateExam";
import Exam from "./Components/Exam/Exam";
import FinishedExam from "./Components/FinishedExam/FinishedExam";
import UserProfile from "./Components/UserProfile/UserProfile";
import TermsAndConditions from "./pages/TermsAndConditions";
import Courses from "./pages/Courses";
import NavBarNew from "./Components/NavBar/NavBarNew";
import MyPathway from "./pages/Student/MyPathway";
import WelcomePage from "./pages/EnrollmentPage/WelcomePage";
import PersonalDetails from "./pages/EnrollmentPage/PersonalDetails";
import EntryExam from "./pages/EnrollmentPage/EntryExam";
import Review from "./pages/EnrollmentPage/Review";
import { EnrollmentProvider } from "./contexts/EnrollmentContext";
import CourseDetails from "./Components/CourseDetails/CourseDetails";
import InstructorLogin from "./pages/InstructorLogin";
import { InstructorAuthProvider } from "./contexts/InstructorAuthContext";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";

const Layout = ({ children }) => {
  return (
    <div className="app">
      <NavBarNew />
      {/* <Navbar /> */}
      <main className="content">{children}</main>
      <footer className="footer">
        <p>© 2025 NPathways</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <InstructorAuthProvider>
      <AuthProvider>
        <EnrollmentProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/InstructorLogin" element={<InstructorLogin />} />

              <Route path="/" element={<Home />} />
              <Route path="register" element={<Register />} />

              {/*Enrollement Router  */}
              <Route path="/enrollment/Welcome" element={<WelcomePage />} />
              <Route
                path="/enrollment/personal-details"
                element={<PersonalDetails />}
              />
              <Route path="/enrollment/entryExam" element={<EntryExam />} />
              <Route path="/enrollment/review" element={<Review />} />
              <Route path="/coursedetails/:id" element={<CourseDetails />} />

              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              {/* End Enrollement Router */}
              {/* ADD YOUR ELEMENT */}
              <Route
                path="/instructor/dashboard"
                element={<InstructorDashboard />}
              />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/student/mypathway" element={<MyPathway />} />
                <Route path="/examDetails" element={<ExamPage />} />
                <Route path="/createExam/:examId?" element={<CreateExam />} />
                <Route path="/finishExam" element={<FinishedExam />} />
                <Route path="/exam/:id" element={<Exam />} />
                <Route path="/user" element={<UserProfile />} />
                <Route path="/courses" element={<Courses />} />
                {/* Add more protected routes here */}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </EnrollmentProvider>
      </AuthProvider>
    </InstructorAuthProvider>
  );
}

export default App;
