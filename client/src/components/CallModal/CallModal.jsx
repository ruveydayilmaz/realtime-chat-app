import React from "react";
import { useSelector } from "react-redux";

import userImg from "../../img/user.png";
import endCall from "../../img/end-call.png";
import acceptCall from "../../img/accept-call.png";
import "./CallModal.css";

const CallModal = ({ data, socket, answerCall }) => {
  const authData = useSelector((state) => state.authReducer.authData);
  const user = authData.data[0]?.user;

  return (
    <div className="call-modal">
      {user._id === data.callReceiver._id ? (
        <>
          <div className="caller-info">
            <img
              src={
                data.callSender.profilePicture
                  ? process.env.REACT_APP_PUBLIC_FOLDER +
                    data.callSender.profilePicture
                  : userImg
              }
              alt="profile"
            />
            <p>{data.callSender.firstname}</p>
          </div>
          <p>is calling..</p>
          <div className="handle-buttons">
            <img
              className="accept-button"
              src={acceptCall}
              onClick={() => answerCall}
            />
            <img
              className="end-button"
              src={endCall}
              onClick={() => answerCall}
            />
          </div>
        </>
      ) : (
        <>
          <div className="caller-info">
            <img
              src={
                data.callReceiver.profilePicture
                  ? process.env.REACT_APP_PUBLIC_FOLDER +
                    data.callReceiver.profilePicture
                  : userImg
              }
              alt="profile"
            />
            <p>{data.callReceiver.firstname}</p>
          </div>
          <div className="handle-buttons">
            <img
              className="end-button"
              src={endCall}
              onClick={() => answerCall}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CallModal;
