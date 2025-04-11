// components/ChatHeader.jsx
import { Box, Typography, Avatar, IconButton, Divider } from "@mui/material";
import { MoreVert, Search, ArrowBack } from "@mui/icons-material";
import { useChat } from "../contexts/ChatContext";
import { useEffect, useState } from "react";

const ChatHeader = () => {
  const { selectedChatId, chats, switchToGeneralChat } = useChat();
  const [headerInfo, setHeaderInfo] = useState({
    title: "General Chat",
    subtitle: "Public chat room",
    avatar: null,
  });

  useEffect(() => {
    if (!selectedChatId) {
      setHeaderInfo({
        title: "General Chat",
        subtitle: "Public chat room",
        avatar: null,
      });
      return;
    }

    const currentChat = chats.find((chat) => chat._id === selectedChatId);
    if (!currentChat) return;

    // For course chats
    if (currentChat.courseId) {
      setHeaderInfo({
        title: currentChat.courseName || "Course Chat",
        subtitle: `${currentChat.users.length} members`,
        avatar: currentChat.courseName?.charAt(0) || "C",
        isCourse: true,
      });
    }
    // For private chats (exactly two users)
    else if (currentChat.users && currentChat.users.length === 2) {
      const currentUserId = localStorage.getItem("userId");
      const otherUser = currentChat.users.find(
        (user) => user.userId._id.toString() !== currentUserId
      );

      if (otherUser) {
        console.log("otherUser", currentChat.users, currentUserId);
        const [firstName, lastName] = otherUser.userName.split(" ");
        setHeaderInfo({
          title: otherUser.userName,
          subtitle: "Private chat",
          avatar: firstName?.charAt(0) || "U",
          isPrivate: true,
        });
      }
    }
    // For group chats with more than two users
    else if (currentChat.users && currentChat.users.length > 2) {
      setHeaderInfo({
        title: `Group (${currentChat.users.length})`,
        subtitle: `${currentChat.users.length} members`,
        avatar: "G",
        isGroup: true,
      });
    }
  }, [selectedChatId, chats]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        height: "80px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {selectedChatId && (
          <IconButton
            sx={{ mr: 1 }}
            onClick={switchToGeneralChat}
            aria-label="back to general chat"
          >
            <ArrowBack />
          </IconButton>
        )}

        {headerInfo.avatar && (
          <Avatar
            sx={{
              mr: 2,
              bgcolor: headerInfo.isCourse
                ? "#7678ee"
                : headerInfo.isPrivate
                ? "#4caf50"
                : "#ff9800",
            }}
          >
            {headerInfo.avatar}
          </Avatar>
        )}

        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#4A3AFF" }}>
            {headerInfo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {headerInfo.subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatHeader;
