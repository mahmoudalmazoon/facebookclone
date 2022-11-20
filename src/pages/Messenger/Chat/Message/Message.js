import { Avatar } from "@mui/material";
import React, { useEffect, useRef } from "react";
import Style from "./Message.module.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const Message = ({ message, date, ow, sender, profilePicture, seen }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [message]);
  return (
    <div className={ow ? Style.messageOw : Style.message} ref={scrollRef}>
      <div className={Style.messageTop}>
        <Avatar src={profilePicture} alt="profilePicture" />
        <p className={Style.messageText}>{message}</p>
        {ow &&<CheckCircleIcon className={seen ? Style.iconSeen : Style.iconNotSeen} />}

      </div>
      <p className={Style.messagedate}>{date}</p>
    </div>
  );
};

export default Message;
