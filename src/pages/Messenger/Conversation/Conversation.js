import React, { useEffect, useState, Fragment } from "react";
import Style from "./Conversation.module.css";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";

const Conversation = ({ conversation, User }) => {
  const [user, setuser] = useState("");
  const [isloading, setisloading] = useState(false);
  const token = window.sessionStorage.getItem("token");
  useEffect(() => {
    setisloading(true);
    const friendId = conversation.members?.find(
      (menber) => menber !== User._id
    );
    const fetchUser = async () => {
      const res = await axios.get(`https://zonabookapi.herokuapp.com/api/user/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setuser(res.data.user);
    };
    fetchUser();
    setisloading(false);
  }, [User._id, conversation, token]);
  return (
    <Fragment>
      {!isloading ? (
        <Fragment>
          <Avatar
            src={user.profilePicture}
            alt={user.userName}
            className={Style.Avatar}
          />
          <p>{user.userName}</p>
        </Fragment>
      ) : (
        <CircularProgress />
      )}
    </Fragment>
  );
};

export default Conversation;
