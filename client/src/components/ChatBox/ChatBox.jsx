import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../api/message.requests";
import { getUser } from "../../api/user.requests";
import "./ChatBox.css";
import { format } from "timeago.js";
import userImg from "../../img/user.png";
import attach from "../../img/attach.png";
import { useSelector } from "react-redux";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage, socket, setIsTyping, isTyping }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState("");

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage.target.value)
  }

  const handleKeyUp = () => {
    // console.log(user.firstname + "durdu")
    // setTyping("")
  }

  const handleKeyDown = () => {
    // console.log(user.firstname + "yaziyor")
    // console.log(isTyping + " is typing")
    // setTyping(isTyping + " is typing" )
    socket.current.emit('typing', user.firstname)
  }

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
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // scroll to bottom
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])


  // Send Message
  const handleSend = async(e)=> {
    e.preventDefault()
    const message = {
      senderId : currentUser,
      text: newMessage,
      chatId: chat._id,
  }
  const receiverId = chat.members.find((id)=>id!==currentUser);
  // send message to socket server
  setSendMessage({...message, receiverId})
  // send message to database
  try {
    const { data } = await addMessage(message);
    setMessages([...messages, data]);
    setNewMessage("");
  }
  catch
  {
    console.log("error")
  }
}

// Receive Message from parent component
useEffect(()=> {
  console.log("Message Arrived: ", receivedMessage)
  if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
    setMessages([...messages, receivedMessage]);
  }

},[receivedMessage])



  const scroll = useRef();
  const imageRef = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <img
                src={
                  userData?.profilePicture
                    ? process.env.REACT_APP_PUBLIC_FOLDER +
                      userData.profilePicture
                    : userImg
                }
                alt="Profile"
                className="followerImage"
                style={{ width: "50px", height: "50px" }}
              />
              <span className="name">
                {userData?.firstname}
              </span>
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                <>
                  <div ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>{" "}
                  </div>
                  <div ref={scroll}
                    className={
                      message.senderId === currentUser
                        ? "time time-own"
                        : "time"
                    }
                  >
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
              
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>
                <img src={attach} alt="attach" />
              </div>
              <input
                id="inputMessage"
                value={newMessage}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
              />
              <div className="send-button button" onClick = {handleSend}>Send</div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Start a conversation
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
