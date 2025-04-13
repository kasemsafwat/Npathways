// components/MessageList.jsx
import { Box, Typography, CircularProgress } from "@mui/material";
import { useChat } from "../contexts/ChatContext";
import MessageCloud from "./MessageCloud";
import { useEffect, useRef } from "react";

const MessageList = () => {
  const { messages, loading, selectedChatId } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest(
        '[data-testid="message-container"]'
      );
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } else {
        // Fallback to previous method
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        mb: "70px", // Space for the message input
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : messages.length > 0 ? (
        <>
          {messages.map((msg, index) => {
            // Format the timestamp
            const formattedTime = msg.time
              ? new Date(msg.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <MessageCloud
                key={msg._id || index}
                message={msg.content}
                isSent={msg.senderId === localStorage.getItem("userId")}
                timestamp={formattedTime}
                sender={msg.userName}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.secondary",
          }}
        >
          <Typography variant="body1">
            {selectedChatId ? "No messages yet" : "Welcome to General Chat"}
          </Typography>
          <Typography variant="body2">
            {selectedChatId
              ? "Start a conversation"
              : "Send a message to everyone"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageList;
