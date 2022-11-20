import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../../Redux/user";
import Style from "./Login.module.css";
const Login = () => {
  const email = useRef();
  const password = useRef();
  const dispatch = useDispatch();
  const [errorMessage, SetErrorMessage] = useState("");
  const [isloading, setIsloading] = useState(false);
  const loginHandle = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await axios.post("https://zonabookapi.herokuapp.com/api/login", {
        email: email.current.value,
        password: password.current.value,
      });
      dispatch(login(res.data.user));
      window.sessionStorage.setItem("token",res.data.token)
      window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      SetErrorMessage(error.response.data.message);
    }
    setIsloading(false);
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
              type="text"
              placeholder="Email"
              className={Style.loginInput}
              ref={email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={Style.loginInput}
              ref={password}
              minLength="6"
              required
            />
            <button
              className={Style.loginButton}
              onClick={loginHandle}
              disabled={isloading}
            >
              {isloading ? <CircularProgress /> : "login"}
            </button>
            <Link to="/forget" className={Style.loginForgot}>Forgot Password?</Link>
            <button className={Style.loginRegisterLink} disabled={isloading}>
              {isloading ? (
                <CircularProgress />
              ) : (
                <Link to="/signUp">Create a New Account</Link>
              )}
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

export default Login;
