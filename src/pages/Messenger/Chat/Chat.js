import { Card, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import Message from "./Message/Message";
import Style from "./Chat.module.css";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import axios from "axios";
const Chat = ({ Messages, conversationId, socket }) => {
  const { user } = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [isloading, setisloading] = useState(false);
  const token = window.sessionStorage.getItem("token");
  const sendMessageHandler = async () => {
    setisloading(true);
    const res = await axios.post(
      `https://zonabookapi.herokuapp.com/api/message/${conversationId}`,
      {
        senderId: user._id,
        text: text,
        profilePicture: user.profilePicture,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const conversation = await axios.get(
      `https://zonabookapi.herokuapp.com/api/conversation/exact/${conversationId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const receiverId = conversation?.data.converation.members.find(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId,
      text: text,
      profilePicture: user.profilePicture,
      _id: Math.random().toString() + Date.now().toString(),
    });
    Messages.push(res.data.saveMessage);
    setText("");
    setisloading(false);
  };
  return (
    <Card className={Style.ChatContainer}>
      <div className={Style.MessageContainer}>
        {Messages?.map((message) => {
          return (
            <Message
              key={message._id}
              profilePicture={message.profilePicture}
              message={message.text}
              date={format(message.createdAt)}
              ow={message.sender === user._id}
              sender={message.sender}
              seen={message.isShow}
            />
          );
        })}
      </div>
      <div className={Style.ChatMessageBottom}>
        <textarea
          className={Style.ChatMessageInput}
          placeholder="write your message ... "
          onChange={(e) => setText(e.target.value)}
          value={text}
        ></textarea>
        <button onClick={sendMessageHandler} disabled={isloading}>
          {!isloading ? (
            <>
              <p>Send</p>
              <SendRoundedIcon className={Style.icon} />
            </>
          ) : (
            <CircularProgress size={20} />
          )}
        </button>
      </div>
    </Card>
  );
};

export default Chat;
