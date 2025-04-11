// Chat.jsx
import { Box, Grid } from "@mui/material";
import { ChatProvider } from "../contexts/ChatContext";
import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatSidebar from "./ChatSidebar";

const Chat = () => (
  <ChatProvider>
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* Chat Content Area (75%) */}
      <Box
        sx={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ChatHeader />
        <ChatContainer>
          <MessageList />
          <MessageInput />
        </ChatContainer>
      </Box>

      {/* Right Sidebar (25%) */}
      <ChatSidebar />
    </Box>
  </ChatProvider>
);

export default Chat;
