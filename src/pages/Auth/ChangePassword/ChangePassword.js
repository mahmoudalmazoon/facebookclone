import React from "react";
import { useState, useRef } from "react";
import Style from "./ChangePassword.module.css";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import axios from "axios";
const ChangePassword = () => {
  const [isloading, setisloading] = useState(false);
  const [errorMessage, SetErrorMessage] = useState("");
  const password = useRef();
  const oldPassword = useRef();
  const confirmPassword = useRef();
  const { user } = useSelector((state) => state.user);
  const token = window.sessionStorage.getItem("token");
  const [message,setmessage] = useState("")
  const ChangePasswordHandler = async (e) => {
    e.preventDefault();
    console.log("Change")
    if (confirmPassword.current.value === password.current.value) {
      setisloading(true);
      try {
        const res = await axios.post(
          `https://zonabookapi.herokuapp.com/api/user/${user._id}/changePassword`,
          {
            oldPassword: oldPassword.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setmessage(res.data.message)
      } catch (error) {
        SetErrorMessage(error.response.data.message)
      }
      setisloading(false);
    } else {
      SetErrorMessage("ConfirmPassword Not Equal To Password");
    }
  };
  return (
    <div className={Style.login}>
      <div className={Style.loginWrapper}>
        <div className={Style.loginLeft}>
          <h3 className={Style.loginLogo}>{user.userName}</h3>
          <span className={Style.loginDesc}>Change Your Email Password</span>
        </div>
        <div className={Style.loginRight}>
          <form className={Style.loginBox} onSubmit={ChangePasswordHandler}>
            <input
              type="password"
              placeholder="oldPassword"
              className={Style.loginInput}
              ref={oldPassword}
              required
            />
            <input
              type="password"
              placeholder="NewPassword"
              className={Style.loginInput}
              ref={password}
              minLength="6"
              required
            />
            <input
              type="password"
              placeholder="ConfirmNewPassword"
              className={Style.loginInput}
              ref={confirmPassword}
              minLength="6"
              required
            />
            <button
              className={Style.loginButton}
              disabled={isloading}
              type="submit"
            >
              {isloading ? <CircularProgress /> : "login"}
            </button>
          </form>
          {errorMessage && (
            <h4 className={Style.errorMessage}>{errorMessage}</h4>
          )}
          {message && (
            <h4 className={Style.Message}>{message}</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
