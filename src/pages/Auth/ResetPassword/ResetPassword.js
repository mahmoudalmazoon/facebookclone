import React from "react";
import { useState } from "react";
import Style from "./ResetPassword.module.css";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { useRef } from "react";
const ResetPassword = () => {
  const [isloading, setisloading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const { token, userId } = useParams();
  console.log(token, userId);
  const newPassword = useRef();
  const ConfirmnewPassword = useRef();
  const history = useHistory();
  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    if (ConfirmnewPassword.current.value === newPassword.current.value) {
      setisloading(true);
      try {
        await axios.post(
          `https://zonabookapi.herokuapp.com/api/user/${userId}/resetpassword`,
          { newpassword: newPassword.current.value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        history.push("/");
      } catch (error) {
        seterrorMessage(error.data.error.message);
      }
      setisloading(false);
    } else {
      seterrorMessage("ConfirmnewPassword Should Equal NewPassword");
    }
  };
  return (
    <div className={Style.login}>
      <div className={Style.loginWrapper}>
        <div className={Style.loginLeft}>
          <h3 className={Style.loginLogo}>ZonaBook</h3>
          <span className={Style.loginDesc}>
            Connect with friends and the world around you on ZonaBook.
          </span>
        </div>
        <div className={Style.loginRight}>
          <form className={Style.loginBox}>
            <input
              type="password"
              placeholder="NewPassword"
              className={Style.loginInput}
              required
              ref={newPassword}
            />
            <input
              type="password"
              placeholder="ConfirmNewPassword"
              className={Style.loginInput}
              required
              ref={ConfirmnewPassword}
            />
            <button
              onClick={resetPasswordHandler}
              className={Style.loginButton}
              disabled={isloading}
            >
              {isloading ? <CircularProgress /> : "ResetPassword"}
            </button>
            {errorMessage && (
              <h4 className={Style.errorMessage}>{errorMessage}</h4>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
