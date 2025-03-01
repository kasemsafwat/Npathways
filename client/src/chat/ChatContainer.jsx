// components/ChatContainer.jsx
import { Grid2, Box } from "@mui/material";

const ChatContainer = ({ children }) => (
  <Box p={10} backgroundColor="#212023" height="750px" overflow="auto">
    <Grid2 container spacing={2} sx={{ height: "100%" }} position="relative">
      {children}
    </Grid2>
  </Box>
);

export default ChatContainer;
