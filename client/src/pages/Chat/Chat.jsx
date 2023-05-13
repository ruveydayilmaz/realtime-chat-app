import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import Navbar from "../../components/Navbar/Navbar";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/chat.requests";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import pencilImg from "../../img/pencil.png";

const Chat = () => {
  const socket = useRef();
  const navRef = useRef(null);

  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [navWidth, setNavWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [active, setActive] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(null);

  const handleMouseDown = (event) => {
    const rightEdge = navRef.current.getBoundingClientRect().right;
    if (event.clientX > rightEdge - 10) {
      setIsResizing(true);
      setPrevMouseX(event.clientX);
    }
  }  
  
  const handleMouseMove = (event) => {
    // console.log(isResizing)
    if (isResizing) {
      const delta = event.clientX - prevMouseX;
      setPrevMouseX(event.clientX);
      window.requestAnimationFrame(() => {
        setNavWidth(prevWidth => {
          const newWidth = prevWidth + delta;
          if (newWidth >= 200 && newWidth < 400) {
            return newWidth;
          } else if (newWidth < 200) {
            return 200;
          } else {
            return 380;
          }
        });
      });
    }
  }  

  const handleMouseUp = () => {
    setIsResizing(false);
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const cursor = isResizing ? 'col-resize' : 'default';

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user?._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user?._id]);

  // Connect to Socket.io and handle online/offline status
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.emit("new-user-add", user?._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    const handleFocus = () => {
      socket.current.emit("new-user-add", user?.id);
    };

    const handleBlur = () => {
      if (user) {
        socket.current.emit("offline");
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [user]);

  // Send message to Socket.io server
  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    });
  }, []);

  useEffect(() => {
    socket.current.on("receive-upload", (data) => {
      console.log('RE UPLOAD', data)
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className={`Chat-container${isResizing ? ' is-resizing' : ''}`}
          ref={navRef}
          style={{ width: navWidth, cursor: cursor }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOver={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        >
          <Navbar socket={socket} />
          <div className="Chat-list">
            {chats.map((chat, index) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user?._id}
                  online={checkOnlineStatus(chat)}
                  index={index}
                  setActiveIndex={setActiveIndex}
                  activeIndex={activeIndex}
                />
              </div>
            ))}
          </div>
          <div className={`new-chat ${active? 'chat-active': 'chat-disabled'}`}>
            <img src={pencilImg} alt="new chat" />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <ChatBox
          socket={socket}
          chat={currentChat}
          currentUser={user?._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
          navWidth={navWidth}
        />
      </div>
    </div>
  );
};

export default Chat;
