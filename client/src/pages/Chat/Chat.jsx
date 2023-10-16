import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import Navbar from "../../components/Navbar/Navbar";

import socketFunctions from "../../utils/socket";
import functions from "./functions";
import { fetchUserChats } from "../../actions/chat.actions";

import pencilImg from "../../img/pencil.png";

import "./Chat.css";

const Chat = () => {
  const socket = useRef();
  const navRef = useRef(null);
  const dispatch = useDispatch();

  const authData = useSelector((state) => state.authReducer.authData);
  const user = authData.data[0]?.user;

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [navWidth, setNavWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [active, setActive] = useState(false);
  const [prevMouseX, setPrevMouseX] = useState(null);

  const loading = useSelector((state) => state.chatReducer.loading);
  const chats = useSelector((state) => state.chatReducer.chats) || [];

  const cursor = isResizing ? "col-resize" : "default";

  useEffect(() => {
    dispatch(fetchUserChats());
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => functions.handleMouseMove(event, setNavWidth, isResizing, prevMouseX, setPrevMouseX);
    const handleMouseUp = () => functions.handleMouseUp(setIsResizing);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    socketFunctions.connectSocket(user, setOnlineUsers);
    socketFunctions.sendMessage(sendMessage);

    if (currentChat) {
      socketFunctions.receiveMessage(setReceivedMessage, currentChat._id);
      socketFunctions.receiveUpload(setReceivedMessage, currentChat._id);
    }
  }, [user, sendMessage, currentChat]);

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div
          className={`Chat-container${isResizing ? " is-resizing" : ""}`}
          ref={navRef}
          style={{ width: navWidth, cursor: cursor }}
          onMouseDown={(event) => functions.handleMouseDown(event, navRef, setIsResizing, setPrevMouseX)}
          onMouseMove={(event) => functions.handleMouseMove(event, setNavWidth, isResizing, prevMouseX, setPrevMouseX)}
          onMouseUp={() => functions.handleMouseUp(setIsResizing)}
          onMouseOver={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
        >
          <Navbar socket={socket} />
          {
            loading ? (
              <div className="loader-div">
                <div className="loader"></div>
              </div>
            ) : (
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
                      online={functions.checkOnlineStatus(chat, onlineUsers, user)}
                      index={index}
                      setActiveIndex={setActiveIndex}
                      activeIndex={activeIndex}
                    />
                  </div>
                ))}
              </div>
            )
          }
          <div className={`new-chat ${active ? "chat-active" : "chat-disabled"}`}>
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
