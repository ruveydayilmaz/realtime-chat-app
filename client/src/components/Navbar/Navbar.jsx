import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth.actions";
import "./Navbar.css";

import userImg from "../../img/user.png";
import logoutImg from "../../img/logout.png";
import hamburgerImg from "../../img/hamburger.png";
import searchImg from "../../img/search.png";

const Navbar = ({socket}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.authReducer.authData);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogOut = ()=> {
    socket.current.emit("offline")   
    dispatch(logout())
  }

  return (
    <div className="nav">
      <img 
        className="menu"
        onClick={() => setMenuOpen(!menuOpen)}         
        src={hamburgerImg} 
        alt="menu" 
      />
      {
        menuOpen && (
          <table className="hamburger-menu">
            <td>
              <tr>
                <img 
                  className="logout-button" 
                  onClick={handleLogOut}         
                  src={user?.profilePicture ? user?.profilePicture : userImg}      
                  alt="logout" 
                />
                <p className="first-name">{user?.firstname}</p>
              </tr>
              <tr onClick={handleLogOut} >
                <img 
                  className="logout-button" 
                  src={logoutImg} 
                  alt="logout" 
                />
                <p>Logout</p>
              </tr>
              <tr>
                <span>Real time Chat App by Ruveyda</span>
              </tr>
            </td>
          </table>          
        )
      }
      <div className="search-bar">
        <img src={searchImg} alt="search" />
        <input type="text" placeholder="Search" />    
      </div>

    </div>
  );
};

export default Navbar;
