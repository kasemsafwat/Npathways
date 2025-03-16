// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";
import Navbar from "./Components/NavBar/NavBar";
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
const Layout = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <main className="content">{children}</main>
      <footer className="footer">
        <p>© 2025 NPathways</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="/examDetails" element={<ExamPage />} />
          <Route path="/createExam/:examId?" element={<CreateExam />} />
          <Route path="/finishExam" element={<FinishedExam />} />
          <Route path="/exam/:id" element={<Exam />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />

          {/* ADD YOUR ELEMENT */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      {/* <div style={{ backgroundColor: "#212023" }}>
        <Button onClick={handleLogin}>Login</Button>
        <Chat />
      </div> */}
      {/* <Register/>
      <Login/> */}
    </>
  );
}

export default App;
