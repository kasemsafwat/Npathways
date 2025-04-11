import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import { useChat } from "../contexts/ChatContext";
import { PersonOutline, School, Forum } from "@mui/icons-material";

const ChatSidebar = () => {
  const [tabValue, setTabValue] = useState(0);
  const {
    users,
    chats,
    handleChatAccess,
    switchToGeneralChat,
    selectedChatId,
  } = useChat();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get course chats (group chats)
  const courseChats = chats.filter((chat) => chat.courseId);

  // Get private chats (one-to-one)
  const privateChats = chats.filter((chat) => !chat.courseId);

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        maxWidth: "350px",
        boxShadow: "-5px 0px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", color: "#4A3AFF" }}
      >
        Chats
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab icon={<Forum />} label="General" />
        <Tab icon={<School />} label="Courses" />
        <Tab icon={<PersonOutline />} label="People" />
      </Tabs>

      <Box sx={{ overflow: "auto", flex: 1 }}>
        {/* General Chat Tab */}
        {tabValue === 0 && (
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={switchToGeneralChat}
                selected={!selectedChatId}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#eeeffa",
                    borderLeft: "4px solid #7678ee",
                  },
                }}
              >
                <ListItemText
                  primary="General Chat"
                  secondary="Public chat room"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}

        {/* Course Chats Tab */}
        {tabValue === 1 && (
          <List>
            {courseChats.length > 0 ? (
              courseChats.map((chat) => (
                <ListItem key={chat._id} disablePadding>
                  <ListItemButton
                    onClick={() => handleChatAccess(chat.courseId)}
                    selected={selectedChatId === chat._id}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#eeeffa",
                        borderLeft: "4px solid #7678ee",
                      },
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: "#7678ee" }}>
                      {chat.courseName?.charAt(0) || "C"}
                    </Avatar>
                    <ListItemText
                      primary={chat.courseName}
                      secondary={`${chat.users.length} members`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
                <Typography>No course chats available</Typography>
              </Box>
            )}
          </List>
        )}

        {/* People (Users) Tab */}
        {tabValue === 2 && (
          <List>
            {users.map((user) => (
              <ListItem key={user._id} disablePadding>
                <ListItemButton
                  onClick={() => handleChatAccess(user._id)}
                  selected={
                    selectedChatId ===
                    privateChats.find((chat) =>
                      chat.users.some((u) => u.userId === user._id)
                    )?._id
                  }
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#eeeffa",
                      borderLeft: "4px solid #7678ee",
                    },
                  }}
                >
                  <Avatar sx={{ mr: 2 }}>
                    {user.firstName?.charAt(0) || "U"}
                  </Avatar>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default ChatSidebar;
