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

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.emit("new-user-add", user?._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {

    const handleFocus = async () => {
      socket.current.emit("new-user-add", user?._id);
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

  useEffect(() => {
    socket.current.on("receive-upload", (data) => {
      console.log(data)
      setReceivedMessage(data);

      if(Array.isArray(data)) {
        const blob = new Blob(data);
        console.log(blob)
        const url = URL.createObjectURL(blob);
        console.log(url)
        return <img src={url} />
      } else {
        console.log(data);
      }
    }
    );
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const sendFile = (e) => {
    const receiverId = currentChat?.members?.find((id) => id !== user?._id);

    console.log(e.target.files[0])

    const file = e.target.files[0];

    if(file.size > 1000000) {
      file.arrayBuffer().then((buffer) => {
        const chunkSize = 1000000;
        const chunks = [];
        let offset = 0;
        while (offset < buffer.byteLength) {
          chunks.push(buffer.slice(offset, offset + chunkSize));
          offset += chunkSize;
        }
        console.log(chunks)
        socket.current.emit("upload", {file: chunks, receiverId: receiverId});
      });
    } else {
      socket.current.emit("upload", {file: file, receiverId: receiverId});
    }
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
                <Conversation
                  data={chat}
                  currentUser={user?._id}
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
          socket={socket}
          chat={currentChat}
          currentUser={user?._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
