import React from 'react';
import {useAuth} from "../context/AuthContext";
import api from "../services/api";
import { useState } from 'react';
import { useEffect } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import socket from "../services/socket";
import toast from 'react-hot-toast';

const Chat = () => {

  const {user, logout, token} = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const response = await api.get("/users");

        setUsers(response.data.users);
        
      } catch (error) {
        console.error("Failed to fetch users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((item) => 
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  // Socket connection
  useEffect(() => {
    if(!token) {
      return;
    }

    socket.auth = {
      token,
    };

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO: ", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [token]);

  // Send message
  const sendMessage = () => {
    if(!messageInput.trim() || !selectedUser) {
      return;
    }

    socket.emit("send-message", {
      receiver: selectedUser._id,
      content: messageInput.trim()
    });

    setMessageInput("");
  };

  // Handle message sent
  useEffect(() => {
    const handleMessageSent = (message) => {
      if(message.receiver._id === selectedUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("message-sent", handleMessageSent);

    return () => {
      socket.off("message-sent", handleMessageSent);
    };
  }, [selectedUser]);

  // Handle new messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      if(message.sender._id === selectedUser?._id || message.receiver._id === selectedUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [selectedUser]);

  // Fetch old messages
  const fetchMessages = async () => {
    try {

      const response = await api.get(`/messages/${selectedUser._id}`);

      setMessages(response.data.messages);
      
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  // Call fetchMessages function
  useEffect(() => {
    if(!selectedUser) {
      return;
    }

    fetchMessages();
  }, [selectedUser]);

  // Online Users
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(new Set(users));
    }

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  // User is online
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

  // User is offline
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

  return (
    <div className='h-screen bg-gray-100 flex overflow-hidden'>

      {/* Sidebar */}
      <aside className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}>

        {/* Current User */}
        <div className='p-4 border-b border-gray-200 flex justify-between items-center'>

          <div className='min-w-0'>
            <h1 className='text-xl font-bold truncate'>
              {user?.username}
            </h1>

            <p className='text-sm text-green-500'>
              Online
            </p>
          </div>

          <button onClick={logout} 
            className='ml-3 shrink-0 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300 cursor-pointer'
          >
            Logout
          </button>

        </div>

        {/* User Search */}
        <div className='p-4 mb-3'>

          <input type="text" 
            placeholder='Search users...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full border border-gray-300 rounded-full px-4 py-2 outline-none text-sm'
          />

        </div>

        {/* User List */}
        <div className='flex-1 overflow-y-auto px-4 pb-4'>

          <div className='space-y-2'>

            {
              filteredUsers.map((item) => (
                <div key={item._id}
                  onClick={() => setSelectedUser(item)}
                  className={`px-4 py-2 rounded-2xl cursor-pointer transition ${
                    selectedUser?._id === item._id
                    ? "bg-teal-700 text-white"
                    : "hover:bg-gray-100"
                  }`}
                >

                  <div className='flex items-center gap-2'>

                    <span className={`w-2 h-2 rounded-full ${onlineUsers.has(item._id) ? "bg-green-500" : "bg-gray-400"}`}/>

                    <h3 className='text-sm truncate'>
                      {item.username}
                    </h3>

                  </div>

                </div>
              ))
            }

          </div>

        </div>

      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col min-w-0 ${selectedUser ? "flex" : "hidden md:flex"}`}>

        {
          selectedUser ? (
            <>
              {/* Chat Header */}
              <header className='bg-white border-b border-gray-200 p-4 flex items-center gap-3'>

                {/* Mobile Back Button */}
                <button onClick={() => setSelectedUser(null)}
                  className='text-sm md:hidden bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer'  
                >
                  <FontAwesomeIcon icon={faArrowLeft}/>
                </button>

                <div className='min-w-0'>
                  <h2 className='text-lg sm:text-xl font-bold truncate'>
                    {selectedUser.username}
                  </h2>

                  <p className={`text-sm ${onlineUsers.has(selectedUser._id) ? "text-green-500" : "text-gray-400"}`}>
                    {
                      onlineUsers.has(selectedUser._id) ? "Online" : "Offline"
                    }
                  </p>
                </div>

              </header>

              {/* Messages Ares */}
              <div className='flex-1 overflow-y-auto p-4 sm:p-6'>

                <div className='flex flex-col gap-2'>

                  {
                    messages.length === 0 ? (
                      <div className='h-full flex items-center justify-center text-center text-gray-400'>

                        <p className='text-sm sm:text-base'>
                          Start Chatting with {selectedUser.username}
                        </p>

                      </div>
                    ) : (
                      messages.map((message) => {

                        const isMine = String(message.sender._id) === String(user.id);

                        return (
                          <div key={message._id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >

                            <div className={`max-w-[70%] rounded-4xl px-4 py-2 ${isMine ? "bg-teal-800 text-white" : "bg-white text-gray-900"}`}>
                              {message.content}
                            </div>

                          </div>
                        );

                      })
                    )
                  }

                </div>

              </div>

              {/* Message Input */}
              <div className='bg-white border-t border-gray-200 p-3 sm:p-4'>

                <div className='flex gap-2 sm:gap-3'>

                  <input type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder='Enter a message...'
                    className='flex-1 min-w-0 border border-gray-300 rounded-4xl px-3 sm:px-4 py-3 outline-none'
                  />

                  <button onClick={sendMessage} 
                    className='bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-6 py-3 rounded-full transition shrink-0'>
                    
                    <span className='hidden sm:inline cursor-pointer'>
                      Send
                    </span>

                    <span className='sm:hidden cursor-pointer'>
                      <FontAwesomeIcon icon={faPaperPlane}/>
                    </span>

                  </button>

                </div>

              </div>
            </>
          ) : (
            // Empty Chat State
            <div className='flex-1 flex items-center justify-center p-6 text-center'>

              <div>

                <h2 className='text-xl sm:text-2xl font-bold text-gray-700'>
                  Welcome to Chat
                </h2>

                <p className='text-gray-500 mt-2 text-sm sm:text-base'>
                  Select a user from the sidebar to start chatting.
                </p>

              </div>

            </div>
          )
        }

      </main>

    </div>
  )
}

export default Chat
