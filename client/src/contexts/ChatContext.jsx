import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import socket from "../helpers/socket";

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
      return { ...state, selectedChatId: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    }
  };

  const handleChatAccess = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:5024/api/chat/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch({ type: "SELECT_CHAT", payload: response.data._id });
      dispatch({ type: "SET_MESSAGES", payload: response.data.messages });
    } catch (err) {
      console.error("Error accessing chat:", err);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    if (state.selectedChatId) {
      try {
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
      socket.emit("sendMessageToGeneral", { message });
    }
  };

  useEffect(() => {
    fetchUsers();

    socket.on("receiveMessageFromGeneral", (message) => {
      if (!state.selectedChatId) {
        dispatch({ type: "ADD_MESSAGE", payload: message });
      }
    });

    return () => {
      socket.off("receiveMessageFromGeneral");
    };
  }, [state.selectedChatId]);

  useEffect(() => {
    if (!state.selectedChatId) return;

    socket.emit("joinChat", { chatId: state.selectedChatId });
    socket.on("receiveMessage", (message) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [state.selectedChatId]);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        handleChatAccess,
        sendMessage,
        switchToGeneralChat,
        fetchUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
