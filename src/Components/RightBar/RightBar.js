import React from "react";
import Friend from "./Friend/Friend";
import Style from "./RightBar.module.css";
import Advertisement from "../../assets/ad.png";
const RightBar = ({Friends}) => {

  return (
    <div className={Style.RightBar}>
      <div>
        <h4 className={Style.title}>events</h4>
        <img
          alt="Advertisement"
          src={Advertisement}
          className={Style.Advertisement}
        />
      </div>
      <img
        alt="Advertisement"
        src={Advertisement}
        className={Style.Advertisement}
      />
      <div>
        <h4 className={Style.title}>Your Friends</h4>
        <ul className={Style.FriendsList}>
          { Friends.map((friend) => {
            return <Friend key={friend._id} friend={friend} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default RightBar;
