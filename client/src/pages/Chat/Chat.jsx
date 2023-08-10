import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { userChats } from "../../api/chat.requests";
import { useSelector } from "react-redux";

import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import Navbar from "../../components/Navbar/Navbar";

import socketFunctions from "../../utils/socket";

import "./Chat.css";
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

  const handleMouseDown = (event) => {
    const rightEdge = navRef.current.getBoundingClientRect().right;
    if (event.clientX > rightEdge - 10) {
      setIsResizing(true);
      setPrevMouseX(event.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (event) => {
    // console.log(isResizing)
    if (isResizing) {
      const delta = event.clientX - prevMouseX;
      setPrevMouseX(event.clientX);
      window.requestAnimationFrame(() => {
        setNavWidth((prevWidth) => {
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
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const cursor = isResizing ? "col-resize" : "default";

  useEffect(() => {
    socketFunctions.connectSocket(user, setOnlineUsers);
  }, [user]);

  useEffect(() => {
    socketFunctions.sendMessage(sendMessage);
  }, [sendMessage]);

  useEffect(() => {
    if (currentChat) {
      socketFunctions.receiveMessage(setReceivedMessage, currentChat._id);
    }
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      socketFunctions.receiveUpload(setReceivedMessage, currentChat._id);
    }
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
        <div
          className={`Chat-container${isResizing ? " is-resizing" : ""}`}
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
                key={index}
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
          <div
            className={`new-chat ${active ? "chat-active" : "chat-disabled"}`}
          >
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
