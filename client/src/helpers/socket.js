import axios from "axios";
import { io } from "socket.io-client";
let userId = localStorage.getItem("userId");
let userName;
console.log(userId);
if (!userId) {
  userId = "no user found";
  userName = "no user found";
} else {
  userName = await axios(`http://localhost:5024/api/user/${userId}`, {
    withCredentials: true,
  }).then((response) => {
    console.log(response.data);
    return response.data.firstName + " " + response.data.lastName;
  });
}

const socket = io("http://localhost:5024", {
  query: { userId, userName },
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

export default socket;
