import React,{useState} from "react";
import { CircularProgress, StyledEngineProvider } from "@mui/material";
import RightBar from "../../Components/RightBar/RightBar";
import SideBar from "../../Components/SideBar/SideBar";
import Feed from "../../Components/Feed/Feed";
import Style from "./Home.module.css";
import { Link } from "react-router-dom";
import ActiveFriend from "../../Components/SideBar/ActiveFriend/ActiveFriend";
const Home = ({Friends,activeList,socket,arrivalPost,updatePost}) => {
  const [ShowActive, SetShowActive] = useState(false);
  const ShowActiveToggle = () => {
    SetShowActive((prevState) => !prevState);
  };
  return (
    <StyledEngineProvider injectfirst>
      {Friends ? (
        <div className={Style.HomeContainer}>
          <SideBar activeList={activeList} />
          <Feed updatePost={updatePost} socket={socket} arrivalPost={arrivalPost} activeList={activeList} />
          <RightBar Friends={Friends} />
        </div>
        
      ) : (
        <CircularProgress />
      )}
      <div className={Style.ActiveFriendsButton}>
                <button
                  onClick={ShowActiveToggle}
                >{`ActiveFriends (${activeList.length})`}</button>
                {ShowActive && (
                  <ul className={Style.ActiveFriends}>
                    {activeList.map((active) => {
                      return (
                        <Link key={active._id} to={`/profile/${active._id}`}>
                          <ActiveFriend
                            ActivePhoto={active.profilePicture}
                            friendName={active.userName}
                          />
                        </Link>
                      );
                    })}
                  </ul>
                )}
      </div>
    </StyledEngineProvider>
  );
};

export default Home;
