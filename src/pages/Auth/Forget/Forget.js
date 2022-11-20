import React, { useState } from "react";
import { useRef } from "react";
import Style from "./Forget.module.css";
import { CircularProgress } from "@mui/material";
import axios from "axios";
const Forget = () => {
  const email = useRef();
  const [isloading, setIsloading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const SendMailHandler = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await axios.post("https://zonabookapi.herokuapp.com/api/forget/sendmail", {
        email: email.current.value,
      });
      console.log("sendMail");
      console.log(res);
    } catch (error) {
      seterrorMessage(error.Message);
    }
    setIsloading(false);
    seterrorMessage("Check Your Email inbox");
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
          <div className={Style.loginBox}>
            <input
              type="text"
              placeholder="Email"
              className={Style.loginInput}
              ref={email}
              required
            />
            <button
              className={Style.loginButton}
              onClick={SendMailHandler}
              disabled={isloading}
            >
              {isloading ? <CircularProgress /> : "SendMail"}
            </button>
            {errorMessage && (
              <h4 className={Style.errorMessage}>{errorMessage}</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
