import { io } from "socket.io-client";

let userId = localStorage.getItem("userId");
let userName;
let socket;

console.log(userId);

if (!userId) {
  userId = "no user found";
  userName = "no user found";
} else {
  userName =
    localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
  if (!userName.trim()) {
    userName = "no user found";
  }
}

socket = io("http://localhost:5024", {
  query: { userId, userName },
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

export default socket;
