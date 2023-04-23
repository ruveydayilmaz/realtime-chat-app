import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { Buffer } from "buffer";

import { addMessage, getMessages } from "../../api/message.requests";
import { getUser } from "../../api/user.requests";
import "./ChatBox.css";

import EmojiImg from "../../img/emoji.png";
import userImg from "../../img/user.png";
import attach from "../../img/attach.png";
import phoneImg from "../../img/phone.png";
import searchImg from "../../img/search.png";
import menuImg from "../../img/menu.png";

const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
  socket,
}) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // maybe i'll do a 'preview selected files' feature one day

  const scroll = useRef();
  const imageRef = useRef();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage.target.value);
  };

  const handleKeyDown = () => {
    const receiver = chat.members.find((id) => id !== currentUser);
    socket.current.emit("typing", {
      typer: user.firstname,
      receiverId: receiver,
    });
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

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        socket.current.emit("message-seen-status", {
          chatId: chat._id,
          userId: user._id,
          status: "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // scroll to bottom
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [scroll, messages]);

  // fetch messages
  useEffect(() => {
    socket.current?.on("get-typing", (data) => {
      setTyping(data.typer + " is typing..");

      // Clear the typing status after 2 seconds
      setTimeout(() => {
        setTyping("");
      }, 2000);
    });
  }, []);

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
    setSendMessage({ ...message, receiverId });
    setSelectedFile(null);
    // send message to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    console.log("Message Arrived: ", receivedMessage);
    setMessages([...messages, receivedMessage]);
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      socket.current.emit("message-seen-status", receivedMessage);
    }
  }, [receivedMessage]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const receiverId = chat.members.find((id) => id !== currentUser);
    socket.current.emit("upload", {
      file,
      receiverId,
      chatId: chat._id,
    });

    try {
      const { data } = await addMessage({
        chatId: chat._id,
        senderId: currentUser,
        file: file,
      });
      setMessages([...messages, data]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));  
      
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString('EN', { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };  

  const renderMessage = (message) => {
    
    if (message) {
      if (message?.file) {
        const imageSrc = `data:image/jpeg;base64,${Buffer.from(
          message.file.data
        ).toString("base64")}`;
        return (
          <>
            <div
              className={
                message.senderId === currentUser ? "message own" : "message"
              }
            >
              <img src={imageSrc} alt="received image" />
            </div>
            <div
              className={
                message.senderId === currentUser ? "time time-own" : "time"
              }
            >
              <span>{formatDate(message.createdAt)}</span>
            </div>
          </>
        );
      } else if (message?._id) {
        return (
          <>
            <div
              className={
                message.senderId === currentUser ? "message own" : "message"
              }
            >
              <span>{message.text}</span>
            </div>
            <div
              className={
                message.senderId === currentUser ? "time time-own" : "time"
              }
            >
              <span>{formatDate(message.createdAt)}</span>
            </div>
          </>
        );
      } else if (message.type === "img") {

        return (
          <>
            <div
              className={
                message.senderId === currentUser ? "message own" : "message"
              }
            >
              <img src={message.props.src} alt="received image" />
            </div>
            <div
              className={
                message.senderId === currentUser ? "time time-own" : "time"
              }
            >
              <span>{formatDate(message.createdAt)}</span>
            </div>
          </>
        );
      } else {
        console.log("Unknown message type:", message.type);
        return <p>Unknown message type</p>;
      }
    }
  }


  return (
    <>
      {
        chat && (
          <>
            {/* chat-header */}
            <div className="chat-header">
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
                  <img src={phoneImg} alt="phone" />
                  <img src={menuImg} alt="menu" />
              </div>
            </div>
          </>
        )
      }
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-body */}
            <div className="chat-body" ref={scroll}>{messages.map(renderMessage)}</div>
            {/* chat-sender */}
            <p>{typing}</p>
            <div className="input-body">
              <div className="chat-sender">
                <img className="emoji" src={EmojiImg} alt="emoji" />
                <input
                  id="inputMessage"
                  value={newMessage}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message"
                />
                <input
                  type="file"
                  name=""
                  id=""
                  style={{ display: "none" }}
                  ref={imageRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                <div onClick={() => imageRef.current.click()}>
                  <img src={attach} alt="attach" />
                </div>
              </div>
              <div className="send-button button" onClick={handleSend}></div>
            </div>

          </>
        ) : (
          <span className="chatbox-empty-message">Start a conversation</span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
