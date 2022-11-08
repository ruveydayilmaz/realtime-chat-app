import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import Navbar from "../../components/Navbar/Navbar";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/chat.requests";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [isTyping, setIsTyping] = useState("");

  var feedback = document.getElementById('feedback');

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();

  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {

    const handleFocus = async () => {
      socket.current.emit("new-user-add", user._id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    };

    const handleBlur = () => {
      if(user) {
        socket.current.emit("offline")   
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };   
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    }

    );
  }, []);

    // Send Message to socket server
    useEffect(() => {
      socket.current.on('typing', (data) => {
        // setIsTyping(data)
        console.log("data: " + data)
        // TODO: i need to access this data value from ChatBox.jsx and handle it there for the typing status
        // feedback.innerHTML = '<p><em>' + data + ' is typing</em></p>';
      })
    }, []);


  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <Navbar socket={socket} />
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2 className="list-title">Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                {/* <div id="feedback"></div> */}
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <ChatBox
          isTyping={isTyping}
          feedback={feedback}
          setIsTyping={setIsTyping}
          socket={socket}
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
