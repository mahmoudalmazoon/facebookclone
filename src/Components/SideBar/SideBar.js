import React from "react";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import GroupIcon from "@mui/icons-material/Group";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Style from "./SideBar.module.css";
import ActiveFriend from "./ActiveFriend/ActiveFriend";
import { Link } from "react-router-dom";
const SideBar = ({ activeList}) => {
  return (
    <div className={Style.SideBar}>
      <div className={Style.IconContainer}>
        <RssFeedIcon />
        <p>Feed</p>
      </div>
      <div className={Style.IconContainer}>
        <ChatIcon />
        <p>Chat</p>
      </div>
      <div className={Style.IconContainer}>
        <PlayCircleFilledIcon />
        <p>Videos</p>
      </div>
      <div className={Style.IconContainer}>
        <GroupIcon />
        <p>Group</p>
      </div>
      <div className={Style.IconContainer}>
        <BookmarkIcon />
        <p>Bookmark</p>
      </div>
      <div className={Style.IconContainer}>
        <EventNoteIcon />
        <p>EventNote</p>
      </div>
      <div className={Style.action}>
        <button className={Style.Button}>Show More</button>
      </div>
      <hr className={Style.hr} />
      <h4 className={Style.ActiveFriendsHide}>Online Friends</h4>
      <ul className={Style.ActiveFriends}>
        {
          activeList.map((friendActive) => {
            return (
              <Link key={friendActive._id} to={`/profile/${friendActive._id}`}>
                <ActiveFriend
                  ActivePhoto={friendActive.profilePicture}
                  friendName={friendActive.userName}
                />
              </Link>
            );
          })}
      </ul>
    </div>
  );
};

export default SideBar;
