import axios from "axios";
// import socket from "./socket";

export function login(email, password) {
  axios
    .post(
      "http://localhost:5024/api/user/login",
      { email, password },
      { withCredentials: true } // Ensure cookies are included
    )
    .then((response) => {
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem(
        "userName",
        `${response.data.firstName} ${response.data.lastName}`
      );
      console.log("Logged in:", response.data);
    })
    .catch((err) => {
      console.error("Couldn't login", err);
    });
}
