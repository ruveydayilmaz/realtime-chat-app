import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/user.requests";
import user from "../../img/user.png";
import "./Conversation.css";

const Conversation = ({ data, currentUser, online }) => {

  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=> {

    const userId = data.members.find((id)=>id!==currentUser)
    const getUserData = async ()=> {
      try
      {
          const {data} =await getUser(userId)
         setUserData(data)
         dispatch({type:"SAVE_USER", data:data})
      }
      catch(error)
      {
        console.log(error)
      }
    }

    getUserData();
  }, [])
  
  return (
    <>
      <div className="conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <div className="friend-list" style={{fontSize: '0.8rem'}}>
            <img
              src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : user}
              alt="Profile"
              className="followerImage"
              style={{ width: "50px", height: "50px" }}
            />
            <div className="user-div">
              <span className="username">{userData?.firstname}</span>           
              <span className="status" style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>              
            </div>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
