import { Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";

const MessageCloud = ({ message, isSent, timestamp }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isSent ? "flex-end" : "flex-start",
        mb: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          maxWidth: "70%",
          p: 1.5,
          borderRadius: 4,
          bgcolor: isSent ? "#7678ee" : "#eeeffa",
          color: isSent ? theme.palette.primary.contrastText : "text.primary",
          // Tail styling
          "&::after": {
            content: '""',
            position: "absolute",
            width: "12px",
            height: "12px",
            bottom: "-6px",
            [isSent ? "right" : "left"]: "20px",
            transform: isSent
              ? "rotate(45deg) skew(10deg, 10deg)"
              : "rotate(45deg) skew(-10deg, -10deg)",
            bgcolor: isSent ? "#7678ee" : "#eeeffa",
            clipPath: "polygon(0 0, 100% 100%, 100% 0)",
          },
        }}
      >
        <Typography variant="body1">{message}</Typography>
        <Typography
          variant="caption"
          display="block"
          sx={{
            textAlign: isSent ? "right" : "left",
            color: isSent ? "rgba(255,255,255,0.7)" : "text.secondary",
            mt: 0.5,
          }}
        >
          Hazem
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageCloud;
