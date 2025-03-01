import { Button } from "@mui/material";
import Chat from "./chat/Chat";
import { login } from "./helpers/api";
import "./helpers/socket";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
function App() {
  function handleLogin() {
    login("Hazem@example.com", "12345678");
  }
  return (
    <>
      <div style={{ backgroundColor: "#212023" }}>
        <Button onClick={handleLogin}>Login</Button>
        <Chat />
      </div>
      {/* <Register/> */}
      {/* <Login/> */}
    </>
  );
}

export default App;
