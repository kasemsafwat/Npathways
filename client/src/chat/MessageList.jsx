// components/MessageList.jsx
import { Box } from "@mui/material";
import { useChat } from "../contexts/ChatContext";
import MessageCloud from "./MessageCloud";

const MessageList = () => {
  const { messages } = useChat();

  return (
    <Box>
      {messages.map((msg) => (
        <MessageCloud
          key={msg._id}
          message={msg.content}
          isSent={false}
          timestamp={msg.time}
          sender={msg.userName}
        />
      ))}
    </Box>
  );
};

export default MessageList;
