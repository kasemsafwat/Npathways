import {
  Box,
  Button,
  Grid2,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import MessageCloud from "./MessageCloud";
import { Send } from "@mui/icons-material";

function Chat() {
  return (
    <Box p={10} backgroundColor={"#212023"} height={"750px"}>
      <Grid2
        container
        spacing={2}
        sx={{ height: "100%" }}
        position={"relative"}
      >
        <Grid2
          size={8}
          sx={{
            backgroundColor: "#f9fbfc",
            borderRadius: "15px",
          }}
        >
          <Box container sx={{ justifyItems: "left", p: "20px" }}>
            <Typography variant="h6" fontWeight={"bold"}>
              General Chat
            </Typography>
            <Typography>23 members</Typography>
          </Box>
          <Box container>
            <MessageCloud
              message="Hello there! How are you today?"
              isSent={false}
              timestamp={new Date()}
            />

            <MessageCloud
              message="I'm doing great! Thanks for asking!"
              isSent={false}
              timestamp={new Date()}
            />
          </Box>
          <Box
            Container
            component={"form"}
            display={"flex"}
            p={2}
            sx={{ bottom: "0px" }}
            position={"absolute"}
            width={"70%"}
          >
            <TextField sx={{ width: "80%" }}></TextField>
            <IconButton>
              <Send>Send</Send>
            </IconButton>
          </Box>
        </Grid2>
        <Grid2
          size={4}
          sx={{ backgroundColor: "#f9fbfc", borderRadius: "15px" }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            backgroundColor={"#dbdcfe"}
            m={2}
            p={3}
            borderRadius={8}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: "15px",
                textTransform: "none",
                backgroundColor: "#ff7a55",
              }}
            >
              General Chat
            </Button>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            backgroundColor={"#dbdcfe"}
            m={2}
            p={3}
            borderRadius={8}
          >
            <Typography variant="h6" fontWeight={500}>
              23 Members
            </Typography>
            <Box display={"flex"} flexDirection={"column"} mt={2}>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                Hazem Ahmed
                <Typography variant="inherit" color="#6c71f8" pl={4}>
                  Admin
                </Typography>
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                >
                  <Typography fontSize={14}>Mahmoud Mohey</Typography>

                  <Typography variant="inherit" fontSize={12} color="#676869">
                    Where you are bro?
                  </Typography>
                </Box>
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                Sohila
                <Typography variant="inherit" color="#6c71f8" pl={4}>
                  Instructor
                </Typography>
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                Kasem
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"flex-start"}
                >
                  <Typography fontSize={14}>Abo Saeed</Typography>

                  <Typography variant="inherit" fontSize={12} color="#676869">
                    <span style={{ color: "#6c71f8" }}>You:</span> Okay, I am on
                    it.
                  </Typography>
                </Box>
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                Nour
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                Omar
              </Button>
              <Button
                sx={{
                  borderRadius: "15px",
                  color: "#212023",
                  m: "4px",
                  cursor: "pointer",
                  textTransform: "none",
                  justifyItems: "left",
                  justifyContent: "left",
                }}
              >
                Ali
              </Button>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Chat;
