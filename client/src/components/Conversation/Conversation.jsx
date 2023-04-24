import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getUser } from "../../api/user.requests";
import "./Conversation.css";

import userImg from "../../img/user.png";
import sentImg from "../../img/sent.png";
import deliveredImg from "../../img/delivered.png";
import seenImg from "../../img/seen.png";

const Conversation = ({
  data,
  currentUser,
  online,
  index,
  setActiveIndex,
  activeIndex,
}) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [messageTime, setMessageTime] = useState();

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();

    const date = new Date(data?.lastMessage?.createdAt);
    const today = new Date();
    if (data?.lastMessage) {
      if (today - date < 1) {
        setMessageTime(`${date.getHours()}:${date.getMinutes()}`);
      } else {
        setMessageTime(
          `${date.toLocaleString("EN", {
            month: "long",
          })} ${date.getDate()}, ${date.getFullYear()}`
        );
      }
    }
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const handleStatus = (status) => {
    switch (status) {
      case "seen":
        return <img src={seenImg} alt="seen" />;
      case "sent":
        return <img src={sentImg} alt="sent" />;
      case "delivered":
        return <img src={deliveredImg} alt="delivered" />;
      default:
        break;
    }
  };

  return (
    <div
      className={`conversation ${index === activeIndex ? "active" : ""}`}
      onClick={() => handleClick(index)}
    >
      <div>
        {online && <div className="online-dot"></div>}
        <div className="friend-list">
          <img
            src={
              userData?.profilePicture
                ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                : userImg
            }
            alt="Profile"
            className="followerImage"
          />
          <div className="user-div">
            <div className="message-div">
              <span className="username">{userData?.firstname}</span>
              <div className="status-div">
                  <span className="status">
                    {currentUser === data?.lastMessage?.senderId &&
                      handleStatus(data?.lastMessage?.status)}
                  </span>
                  <span className="last-message-time">{messageTime}</span>                
              </div>            
            </div>
            <span className="last-message">{data?.lastMessage?.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
