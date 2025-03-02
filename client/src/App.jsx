import { Button } from "@mui/material";
import Chat from "./chat/Chat";
import { login } from "./helpers/api";
import "./helpers/socket";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import ExamPage from "./Components/ExamPage/ExamPage";
import NavBar from "./Components/NavBar/NavBar";
function App() {
  function handleLogin() {
    login("Hazem@example.com", "12345678");
  }
  return (
    <>
  {/*     <div style={{ backgroundColor: "#212023" }}>
        <Button onClick={handleLogin}>Login</Button>
        <Chat />
      </div> */}
      {/* <Register/> */}
      {/* <Login/> */}
      <ExamPage></ExamPage>
      {/* <NavBar></NavBar> */}
    </>
  );
}

export default App;
