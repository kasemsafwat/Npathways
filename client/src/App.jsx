// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";
import Navbar from "./components/NavBar/Navbar";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
// Layout component that includes the Navbar
const Layout = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <main className="content">{children}</main>
      <footer className="footer">
        <p>© 2025 Your Website</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;
