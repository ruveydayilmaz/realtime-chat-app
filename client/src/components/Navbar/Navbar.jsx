import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth.actions";
import "./Navbar.css";
import logoutImg from "../../img/logout.png";
import userImg from "../../img/user.png";

const Navbar = ({socket}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.authReducer.authData);

  const handleLogOut = ()=> {
    socket.current.emit("offline")   
    dispatch(logout())
  }

  return (
    <div className="nav">
      <img 
        className="profile-picture"
        onClick={handleLogOut}         
        src={user.profilePicture ? user.profilePicture : userImg} 
        alt="logout" 
      />
      <p className="first-name">{user.firstname}</p>
      <img 
        onClick={handleLogOut} 
        className="logout-button" 
        src={logoutImg} 
        alt="logout" 
      />
    </div>
  );
};

export default Navbar;
