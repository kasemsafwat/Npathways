// Chat.jsx
import { Grid2 } from "@mui/material";
import { ChatProvider } from "../contexts/ChatContext";
import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserListSection from "./UserListSection";

const Chat = () => (
  <ChatProvider>
    <ChatContainer>
      <Grid2 size={8} sx={{ backgroundColor: "#f9fbfc", borderRadius: "15px" }}>
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </Grid2>
      <UserListSection />
    </ChatContainer>
  </ChatProvider>
);

export default Chat;
