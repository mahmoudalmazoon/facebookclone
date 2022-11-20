import React from "react";
import { Avatar } from "@mui/material";
import Style from "./Friend.module.css";
import { Link } from "react-router-dom";
const Friend = ({ friend }) => {
  return (
    <Link to={`/profile/${friend._id}`}>
      <li className={Style.Friend}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
          }}
          alt="Remy Sharp"
          src={friend.friend}
          className={Style.Avatar}
        />
        <p className={Style.FriendName}>{friend.userName}</p>
      </li>
    </Link>
  );
};

export default Friend;
