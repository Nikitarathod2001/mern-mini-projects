import React, {createContext, useContext, useEffect, useState} from "react";

import { useAuth } from "./AuthContext";
import socket from "../services/socket";


const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const {token} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if(!token) {
      return;
    }

    socket.auth = {token};

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected: ", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [token]);

  // Receive message sent by current user
  useEffect(() => {
    const handleMessageSent = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message-sent", handleMessageSent);

    return () => {
      socket.off("message-sent", handleMessageSent);
    };
  }, []);

  // Receive message sent by another user
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);

  // Initial online users
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(new Set(users));
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  // User becomes online
  useEffect(() => {
    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.add(userId);
        return updated;
      });
    };

    socket.on("user-online", handleUserOnline);

    return () => {
      socket.off("user-online", handleUserOnline);
    };
  }, []);

  // User becomes offline
  useEffect(() => {
    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  const sendMessage = (receiver, content) => {
    socket.emit("send-message", {
      receiver, content,
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const loadMessages = (messages) => {
    setMessages(messages);
  };

  return (
    <SocketContext.Provider value={{
      onlineUsers, messages, sendMessage, clearMessages, loadMessages
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if(!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
};

