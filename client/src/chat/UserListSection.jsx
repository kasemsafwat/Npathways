// components/UserListSection.jsx
import { Grid2, Box, Button, Typography } from "@mui/material";
import { useChat } from "../contexts/ChatContext";

const UserListSection = () => {
  const { users, handleChatAccess, switchToGeneralChat } = useChat();

  return (
    <Grid2 size={4} sx={{ backgroundColor: "#f9fbfc", borderRadius: "15px" }}>
      <Box
        display="flex"
        flexDirection="column"
        backgroundColor="#dbdcfe"
        m={2}
        p={3}
        borderRadius={8}
      >
        <Button
          variant="contained"
          sx={{
            borderRadius: "15px",
            textTransform: "none",
            backgroundColor: "#04CD00",
          }}
          onClick={switchToGeneralChat}
        >
          General Chat
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        backgroundColor="#dbdcfe"
        m={2}
        p={3}
        borderRadius={8}
      >
        <Typography variant="h6" fontWeight={500}>
          Members
        </Typography>
        <Box display="flex" flexDirection="column" mt={2}>
          {users.map((user) => (
            <Button
              key={user._id}
              onClick={() => handleChatAccess(user._id)}
              sx={{
                borderRadius: "15px",
                color: "#212023",
                m: "4px",
                textTransform: "none",
                justifyContent: "flex-start",
              }}
            >
              {`${user.firstName} ${user.lastName}`}
            </Button>
          ))}
        </Box>
      </Box>
    </Grid2>
  );
};

export default UserListSection;
