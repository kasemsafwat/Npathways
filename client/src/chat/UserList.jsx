import { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5024/api/user/all", {
          withCredentials: true,
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChatAccess = (userId) => {
    axios
      .post(
        `http://localhost:5024/api/chat/${userId}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Chat accessed:", response.data);
      })
      .catch((err) => {
        console.error("Error accessing chat:", err);
        // Handle errors appropriately
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      {users.map((user) => (
        <Button
          key={user._id}
          onClick={() => handleChatAccess(user._id)}
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
          {`${user.firstName} ${user.lastName}`}
        </Button>
      ))}
    </>
  );
};

export default UserList;
