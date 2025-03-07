// components/ChatHeader.jsx
import { Box, Typography } from "@mui/material";
import { useChat } from "../contexts/ChatContext";

const ChatHeader = () => {
  const { selectedChatId } = useChat();
  return (
    <Box sx={{ justifyItems: "left", p: "20px" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#4A3AFF" }}>
        {selectedChatId ? `Chat with ${selectedChatId}` : "General Chat"}
      </Typography>
      <Typography>Members</Typography>
    </Box>
  );
};

export default ChatHeader;
