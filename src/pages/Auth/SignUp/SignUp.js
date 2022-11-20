import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Style from "./SignUp.module.css";
const SignUp = () => {
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const mobileNumber = useRef();
  const From = useRef();
  const City = useRef();
  const nickName = useRef();
  const confirmPassword = useRef();
  const [Gender, setGender] = useState("");
  const [RelationShip, setRelationShip] = useState("");
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const [errorMessage, seterrorMessage] = useState("");

  const signUpHandler = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      await axios.post("https://zonabookapi.herokuapp.com/api/signup", {
        userName: userName.current.value,
        email: email.current.value,
        password: password.current.value,
        confirmPassword: confirmPassword.current.value,
        from: From.current.value,
        mobileNumber: mobileNumber.current.value,
        city: City.current.value,
        nickname: nickName.current.value,
        Gender: Gender,
        Relationship: RelationShip,
      });
      history.push("/login");
    } catch (error) {
      seterrorMessage(error.response.data.message)
    }
    setloading(false);
  };
  const SelectHandlerGender = (e) => {
    setGender(e.target.value);
  };
  const SelectHandlerRelationShip = (e) => {
    setRelationShip(e.target.value);
  };
  return (
    <div className={Style.login}>
      <div className={Style.loginWrapper}>
        <div className={Style.loginLeft}>
          <h3 className={Style.loginLogo}>zonaBook</h3>
          <span className={Style.loginDesc}>
            Connect with friends and the world around you on zonaBook.
          </span>
        </div>
        <div className={Style.loginRight}>
          <form onSubmit={signUpHandler} className={Style.loginBox}>
            <input
              placeholder="userName"
              className={Style.loginInput}
              ref={userName}
              required
            />
            <input
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
              required
            />
            <input
              type="password"
              placeholder="confirmPassword"
              className={Style.loginInput}
              ref={confirmPassword}
              required
            />
            <input
              type="phone"
              placeholder="mobileNumber"
              className={Style.loginInput}
              ref={mobileNumber}
            />
            <input
              placeholder="From"
              className={Style.loginInput}
              ref={From}
              required
            />
            <input
              type="text"
              placeholder="City"
              className={Style.loginInput}
              ref={City}
              required
            />
            <input
              type="text"
              placeholder="nickName"
              className={Style.loginInput}
              ref={nickName}
              required
            />
            <select
              required
              className={Style.loginInput}
              onChange={SelectHandlerRelationShip}
            >
              <option value="RelationShio" disabled>
                RelationShio
              </option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Other">Other</option>
            </select>
            <select
              onChange={SelectHandlerGender}
              required
              className={Style.loginInput}
            >
              <option value="Gender" disabled>
                Gender
              </option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
            <button
              className={Style.loginButton}
              disabled={loading}
            >
              {loading ? <CircularProgress /> : "Sign Up"}
            </button>
            <button className={Style.loginRegisterLink} disabled={loading}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Link to="/login">Log into Account</Link>
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

export default SignUp;
