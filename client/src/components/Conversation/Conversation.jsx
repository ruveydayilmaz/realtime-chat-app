import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/user.requests";
import user from "../../img/user.png";
import "./Conversation.css";

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
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
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
                : user
            }
            alt="Profile"
            className="followerImage"
          />
          <div className="user-div">
            <span className="username">{userData?.firstname}</span>
            <span className="status" style={{ color: online ? "#51e200" : "" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
