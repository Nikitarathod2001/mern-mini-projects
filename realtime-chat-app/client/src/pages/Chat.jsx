import React from 'react';
import {useAuth} from "../context/AuthContext";
import api from "../services/api";
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane, faArrowLeft, faCheck, faCheckDouble} from "@fortawesome/free-solid-svg-icons";
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { formatMessageDate, formatMessageTime } from '../utils/dateUtils';

const Chat = () => {

  const {user, logout, token} = useAuth();

  const {
    onlineUsers, messages, sendMessage, loadMessages,
    typingUsers, startTyping, stopTyping, markMessagesRead
  } = useSocket();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  
  const [messageInput, setMessageInput] = useState("");

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  const isSelectedUserTyping = selectedUser && typingUsers.has(selectedUser._id);

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

  // Send message
  const handleSendMessage = () => {
    if(!messageInput.trim() || !selectedUser) {
      return;
    }

    sendMessage(
      selectedUser._id,
      messageInput.trim()
    );

    stopTyping(selectedUser._id);

    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessageInput("");
  };

  // Fetch old messages
  const fetchMessages = async () => {
    try {

      const response = await api.get(`/messages/${selectedUser._id}`);

      loadMessages(response.data.messages);

      markMessagesRead(selectedUser._id);
      
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

  // Conversation Messages
  const conversationMessages = messages.filter((message) => {
    if(!message?.sender || !message?.receiver || !selectedUser) {
      return false;
    }

    const senderId = String(message.sender._id);
    const receiverId = String(message.receiver._id);
    const selectedId = String(selectedUser._id);

    return (
      senderId === selectedId || receiverId === selectedId
    );
  });

  // Scroll Function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Automatically scroll
  useEffect(() => {
    if(!selectedUser) {
      return;
    }

    scrollToBottom();
  }, [conversationMessages, selectedUser]);

  // Handle Typing
  const handleTyping = (e) => {
    const value = e.target.value;

    setMessageInput(value);

    if(!selectedUser) {
      return;
    }

    // If input is empty, immediately stop typing
    if(!value.trim()) {
      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      stopTyping(selectedUser._id);
      return;
    }

    // Tell receiver that user started typing
    startTyping(selectedUser._id);

    // Clear previous timeout
    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Wait before declaring "Stopped typing"
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedUser._id);
    }, 1000);
  };

  // Clean up typing timer
  useEffect(() => {
    return () => {
      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, []);

  // Stop typing when changing users
  useEffect(() => {
    return () => {
      if(selectedUser) {
        stopTyping(selectedUser._id);
      }

      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedUser]);

  // Handle selected user
  const handleSelectedUser = (item) => {
    if(selectedUser) {
      stopTyping(selectedUser._id);
    }

    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessageInput("");
    setSelectedUser(item);
  };

  // Mark newly received messages as read
  useEffect(() => {
    if(!selectedUser) {
      return;
    }

    const unreadMessages = conversationMessages.filter((message) => String(message.sender._id) === String(selectedUser._id) && message.status !== "read");

    if(unreadMessages.length > 0) {
      markMessagesRead(selectedUser._id);
    }
  }, [conversationMessages, selectedUser]);

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
                  onClick={() => handleSelectedUser(item)}
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

                  <p className={`text-sm 
                    ${isSelectedUserTyping 
                      ? "text-teal-500"
                      : onlineUsers.has(selectedUser._id) ? "text-green-500" : "text-gray-400"
                    }`}>
                    {
                      isSelectedUserTyping ? "typing..."
                      : onlineUsers.has(selectedUser._id) ? "Online" : "Offline"
                    }
                  </p>
                </div>

              </header>

              {/* Messages Ares */}
              <div className='flex-1 overflow-y-auto p-4 sm:p-6'>

                <div className='flex flex-col gap-2'>

                  {
                    conversationMessages.length === 0 ? (
                      <div className='h-full flex items-center justify-center text-center text-gray-400'>

                        <p className='text-sm sm:text-base'>
                          Start Chatting with {selectedUser.username}
                        </p>

                      </div>
                    ) : (
                      conversationMessages.map((message, index) => {

                        const currentDate = formatMessageDate(message.createdAt);

                        const previousDate = index > 0 ?
                         formatMessageDate(conversationMessages[index - 1].createdAt)
                         : null;

                        const showDateSeparator = currentDate !== previousDate;

                        const isMine = String(message.sender._id) === String(user.id);

                        return (
                          <div key={message._id}>

                            {/* Date Separator */}
                            {
                              showDateSeparator && (
                                <div className='flex justify-center my-4'>

                                  <span className='bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full'>
                                    {currentDate}
                                  </span>

                                </div>
                              )
                            }

                            {/* Message */}
                            <div className={`flex ${
                              isMine ? "justify-end" : "justify-start"
                            }`}>

                              <div className={`max-w-[70%] rounded-4xl px-4 py-2 ${isMine ? "bg-teal-800 text-white" : "bg-white text-gray-900"}`}>
                                
                                <div className='flex items-end gap-1'>

                                  <span>
                                    {message.content}
                                  </span>

                                  <span className={`text-[10px] sm:text-[9px] whitespace-nowrap ${
                                    isMine ? "text-gray-300" : "text-gray-600"
                                  }`}>
                                    {formatMessageTime(message.createdAt)}
                                  </span>

                                  {
                                    isMine && (
                                      <>
                                        {
                                          message.status === "sent" && (
                                            <FontAwesomeIcon icon={faCheck}
                                              className='text-[11px] text-gray-300 ml-1'
                                            />
                                          )
                                        }

                                        {
                                          message.status === "delivered" && (
                                            <FontAwesomeIcon icon={faCheckDouble}
                                              className='text-[11px] text-gray-300 ml-1'
                                            />
                                          )
                                        }

                                        {
                                          message.status === "read" && (
                                            <FontAwesomeIcon icon={faCheckDouble}
                                              className='text-[11px] text-blue-300 ml-1'
                                            />
                                          )
                                        }
                                      </>
                                    )
                                  }

                                </div>

                              </div>

                            </div>

                          </div>
                        );

                      })
                    )
                  }

                  {/* Typing Indicator */}
                  {
                    isSelectedUserTyping && (
                      <div className='flex justify-start mt-3'>

                        <div className='bg-white text-gray-500 px-4 py-2 rounded-4xl shadow-sm'>

                          <span className='animate-pulse'>
                            typing...
                          </span>

                        </div>

                      </div>
                    )
                  }

                  {/* Scroll target */}
                  <div ref={messagesEndRef}/>

                </div>

              </div>

              {/* Message Input */}
              <div className='bg-white border-t border-gray-200 p-3 sm:p-4'>

                <div className='flex gap-2 sm:gap-3'>

                  <input type="text" 
                    value={messageInput}
                    onChange={handleTyping}
                    placeholder='Enter a message...'
                    className='flex-1 min-w-0 border border-gray-300 rounded-4xl px-3 sm:px-4 py-3 outline-none'
                  />

                  <button onClick={handleSendMessage} 
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
