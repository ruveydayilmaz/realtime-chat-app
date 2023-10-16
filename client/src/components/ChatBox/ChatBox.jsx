import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "../../api/user.requests";
import socketFunctions from "../../utils/socket";
import functions from "./functions";

import "./ChatBox.css";

import EmojiImg from "../../img/emoji.png";
import userImg from "../../img/user.png";
import attach from "../../img/attach.png";
import phoneImg from "../../img/phone.png";
import searchImg from "../../img/search.png";
import menuImg from "../../img/menu.png";
import { addMessage } from "../../actions/message.actions";

const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
  navWidth,
}) => {
  const authData = useSelector((state) => state.authReducer.authData);
  const user = authData.data[0]?.user;
  
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // maybe i'll do a 'preview selected files' feature one day

  const loading = useSelector((state) => state.mutualReducer.loading);

  const scroll = useRef();
  const imageRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage.target.value);
  };

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    setMessages([]);
    socketFunctions.fetchMessages(user, chat, setMessages, currentUser, dispatch);
  }, [chat]);

  useEffect(() => {
    socketFunctions.fetchTyping(setTyping);
  }, []);

  useEffect(() => {
    socketFunctions.receiveMessageFromParent(
      receivedMessage,
      chat,
      setMessages,
      currentUser,
      messages
    );
  }, [receivedMessage]);

  const handleKeyDown = () => {
    socketFunctions.sendTyping(user, chat, currentUser);
  };

  const handleFileSelect = (event) => {
    socketFunctions.handleFileSelect(
      event,
      chat,
      setSelectedFile,
      setMessages,
      currentUser,
      setNewMessage,
      messages
    );
  };

  // scroll to bottom
  useEffect(() => {
    // fetching the chat div using the get element by id and then scrolling to the bottom
    var chatDiv = document.getElementById("chat-body");
    chatDiv?.scrollTo({ top: chatDiv.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
      status: "",
    };
    const receiverId = chat.members.find((id) => id !== currentUser);
    // send message to socket server
    setSendMessage({ ...message, receiverId, createdAt: new Date() });
    setSelectedFile(null);
    // send message to database
    try {
      const data = await dispatch(addMessage(message));
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {chat && (
        <div
          className="chat-header"
          style={{ width: `calc(100% - ${navWidth}px)` }}
        >
          {" "}
          {/* chat-header */}
          <div className="profile">
            <img
              src={
                userData?.profilePicture
                  ? process.env.REACT_APP_PUBLIC_FOLDER +
                  userData.profilePicture
                  : userImg
              }
              alt="Profile"
            />
            <span className="name">{userData?.firstname}</span>
          </div>
          <div className="menu">
            <img src={searchImg} alt="search" />
            <img src={phoneImg} alt="phone" /> {/* onClick={sendCall} */}
            <img src={menuImg} alt="menu" />
          </div>
        </div>
      )}
      <div className="ChatBox-container">
        {chat ? (
          loading ? (
            <div className="chat-loader-div">
              <div className="chat-loader"></div>
            </div>
          ) : (
            <>
              {/* chat-body */}
              <div className="chat-body" id="chat-body" ref={scroll}>
                {messages.map((message, index) => functions.renderMessage(message, index, messages, currentUser))}
              </div>
              {/* chat-sender */}
              <p style={{ color: "white" }}>{typing}</p>
              <div className="input-body">
                <div className="chat-sender">
                  <img className="emoji" src={EmojiImg} alt="emoji" />
                  <input id="inputMessage" value={newMessage} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Message" />
                  <input type="file" style={{ display: "none" }} ref={imageRef} onChange={handleFileSelect} accept="image/*" />
                  
                  <div onClick={() => imageRef.current.click()}>
                    <img src={attach} alt="attach" />
                  </div>
                </div>
                <div className="send-button button" onClick={handleSend}></div>
              </div>
            </>
          )
        ) : (
          <span className="chatbox-empty-message">Start a conversation</span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
