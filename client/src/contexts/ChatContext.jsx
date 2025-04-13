import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatContext = createContext();

const initialState = {
  messages: [],
  users: [],
  selectedChatId: null,
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload, loading: false };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SELECT_CHAT":
      return { ...state, selectedChatId: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [chats, setChats] = useState([]);
  const [courses, setCourses] = useState([]);
  const [socket, setSocket] = useState(null);

  const userId = localStorage.getItem("userId");
  const userName =
    localStorage.getItem("firstName") && localStorage.getItem("lastName")
      ? localStorage.getItem("firstName") +
        " " +
        localStorage.getItem("lastName")
      : "no user found";

  useEffect(() => {
    const newSocket = io("http://localhost:5024", {
      query: { userId, userName },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, userName]);

  const switchToGeneralChat = () => {
    dispatch({ type: "SELECT_CHAT", payload: null });
    dispatch({ type: "SET_MESSAGES", payload: [] });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5024/api/user/all", {
        withCredentials: true,
      });
      dispatch({ type: "SET_USERS", payload: response.data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch users" });
      console.error("Error fetching users:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5024/api/course/enrolledCourses",
        { withCredentials: true }
      );
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleChatAccess = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post(
        `http://localhost:5024/api/chat/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch({ type: "SELECT_CHAT", payload: response.data._id });
      dispatch({ type: "SET_MESSAGES", payload: response.data.messages });

      // Refresh the chat list after accessing a new chat
      fetchChats();
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Error accessing chat" });
      console.error("Error accessing chat:", err);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim() || !socket) return;

    if (state.selectedChatId) {
      try {
        // Add temporary message to UI for immediate feedback
        const tempMessage = {
          _id: Date.now().toString(),
          content: message,
          senderId: userId,
          userName,
          time: new Date().toISOString(),
        };
        dispatch({ type: "ADD_MESSAGE", payload: tempMessage });

        // Send to server
        await axios.post(
          `http://localhost:5024/api/chat/sendMessage/${state.selectedChatId}`,
          { message },
          { withCredentials: true }
        );
        socket.emit("sendMessage", { chatId: state.selectedChatId, message });
      } catch (err) {
        console.error("Error sending private message:", err);
      }
    } else {
      // For general chat
      const tempMessage = {
        _id: Date.now().toString(),
        content: message,
        senderId: userId,
        userName,
        time: new Date().toISOString(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: tempMessage });
      socket.emit("sendMessageToGeneral", { message });
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5024/api/chat/getAllChats",
        {
          withCredentials: true,
        }
      );
      setChats(response.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchUsers();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessageFromGeneral", (message) => {
      if (!state.selectedChatId) {
        const currentUserId = localStorage.getItem("userId");
        // console.log(message.senderId, currentUserId);
        if (message.senderId !== currentUserId)
          dispatch({ type: "ADD_MESSAGE", payload: message });
      }
    });

    return () => {
      socket.off("receiveMessageFromGeneral");
    };
  }, [state.selectedChatId, socket]);

  useEffect(() => {
    if (!state.selectedChatId || !socket) return;

    socket.emit("joinChat", { chatId: state.selectedChatId });
    socket.on("receiveMessage", (message) => {
      const currentUserId = localStorage.getItem("userId");
      if (message.senderId !== currentUserId)
        dispatch({ type: "ADD_MESSAGE", payload: message });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [state.selectedChatId, socket]);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        handleChatAccess,
        sendMessage,
        switchToGeneralChat,
        fetchUsers,
        chats,
        setChats,
        courses,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);
