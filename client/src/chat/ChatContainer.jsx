// components/ChatContainer.jsx
import { Box } from "@mui/material";

const ChatContainer = ({ children }) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "calc(100% - 80px)",
      position: "relative",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      margin: 2,
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
    }}
  >
    {children}
  </Box>
);

export default ChatContainer;
