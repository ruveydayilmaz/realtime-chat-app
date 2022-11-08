import React, { useState } from "react";
import "./Auth.css";
import { logIn, signUp } from "../../actions/auth.actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const initialState = {
    firstname: "",
    username: "",
    password: "",
    confirmpass: "",
  };
  const loading = useSelector((state) => state.authReducer.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);

  const [data, setData] = useState(initialState);

  const [confirmPass, setConfirmPass] = useState(true);

  // const dispatch = useDispatch()

  // Reset Form
  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
  };

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Form Submission
  const handleSubmit = (e) => {
    setConfirmPass(true);
    e.preventDefault();
    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data, navigate))
        : setConfirmPass(false);
    } else {
      dispatch(logIn(data, navigate));
    }
  };

  return (
    <div className="Auth">
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3 className="title" >{isSignUp ? "Register" : "Login"}</h3>

        {isSignUp && (
          <input
            required
            type="text"
            placeholder="Name"
            className="input-div"
            name="firstname"
            value={data.firstname}
            onChange={handleChange}
          />
        )}

        <input
          required
          type="text"
          placeholder="Username"
          className="input-div"
          name="username"
          value={data.username}
          onChange={handleChange}
        />

        <input
          required
          type="password"
          className="input-div"
          placeholder="Password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />

        {isSignUp && (
          <input
            required
            type="password"
            className="input-div"
            name="confirmpass"
            placeholder="Confirm Password"
            onChange={handleChange}
          />
        )}

        <span
          style={{
            color: "red",
            fontSize: "12px",
            alignSelf: "flex-end",
            marginRight: "5px",
            display: confirmPass ? "none" : "block",
          }}
        >
          *Confirm password is not same
        </span>
        <div className="login-div">
          <span
            className="link"
            onClick={() => {
              resetForm();
              setIsSignUp((prev) => !prev);
            }}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </span>
          <button
            className="button login-button"
            type="Submit"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "SignUp" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
