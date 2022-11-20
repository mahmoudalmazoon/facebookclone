import React, { useState, useEffect } from "react";
import Style from "./TopBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { Badge, CircularProgress } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Avatar from "@mui/material/Avatar";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { format } from "timeago.js";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import Tooltip from "@mui/material/Tooltip";
// import PersonAdd from "@mui/icons-material/PersonAdd";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { login, logout } from "../../Redux/user";
import logo from "../../assets/Screenshot (5).png";
const TopBar = ({ unSeenMessageList, socket, SetUnSeenMessageList }) => {
  const { user } = useSelector((state) => state.user);
  const [search, setsearch] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [showFriendRequest, setshowFriendRequest] = useState(false);
  const [requestsList, setrequestsList] = useState(user?.friendrequest);
  const [SearchList, SetSearchList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const token = window.sessionStorage.getItem("token");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const ToggleFriendRequest = () => {
    setshowFriendRequest((prevState) => !prevState);
  };
  const searchHandler = async (e) => {
    setsearch(e.target.value);
    if (e.target.value) {
      setIsloading(true);
      const res = await axios.post(
        `https://zonabookapi.herokuapp.com/api/user/users/all`,
        {
          userName: e.target.value,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      SetSearchList(res.data.Users);
      setIsloading(false);
    } else {
      SetSearchList([]);
    }
  };
  const searchHandlerSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    const res = await axios.post(
      `https://zonabookapi.herokuapp.com/api/user/users/all`,
      {
        userName: search,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res);
    setIsloading(false);
    setsearch("");
  };
  const FriendHandler = async (userId) => {
    setrequestsList(
      requestsList.filter((r) => {
        return r.creatorId !== userId;
      })
    );
    await axios.post(
      `https://zonabookapi.herokuapp.com/api/user/${userId}/Friend`,
      {
        userId: user._id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const res = await axios.post(
      `https://zonabookapi.herokuapp.com/api/user/${user._id}/removefriendrequest`,
      {
        userId: userId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
    dispatch(login(res.data.user));
  };
  const FriendCancelHandler = async (userId) => {
    const res = await axios.post(
      `https://zonabookapi.herokuapp.com/api/user/${user._id}/removefriendrequest`,
      {
        userId: userId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setrequestsList((prevState) =>
      prevState.filter((r) => {
        return r.creatorId !== userId;
      })
    );
    window.sessionStorage.setItem("user", JSON.stringify(res.data.user));
    dispatch(login(res.data.user));
  };
  const BlurHandler = () => {
    setShowSearch(false);
    SetSearchList([]);
    setsearch("");
  };
  const logoutHandler = () => {
    dispatch(logout());
    window.sessionStorage.removeItem("user");
  };
  useEffect(() => {
    socket.current.on("getFreiendRequest", async (data) => {
      setrequestsList((prevState) => [...prevState, data]);
      const result = await axios.get(
        `https://zonabookapi.herokuapp.com/api/user/${user?._id}`,
        { headers: { Authorization: `Bearer   ${token}` } }
      );
      window.sessionStorage.setItem("user", JSON.stringify(result.data.user));
      setrequestsList(result.data.user.friendrequest);
    });
  }, [socket, token, user]);
  useEffect(() => {
    socket.current.on("getMessage", async () => {
      const result = await axios.get(
        `https://zonabookapi.herokuapp.com/api/message/unSeen/${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        }
      );
      SetUnSeenMessageList(result.data.unSeen);
    });
  }, [socket, token, user, SetUnSeenMessageList]);
  useEffect(() => {
    socket.current.on("getUnSeenList", async () => {
      const result = await axios.get(
        `https://zonabookapi.herokuapp.com/api/message/unSeen/${user?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        }
      );
      SetUnSeenMessageList(result.data.unSeen);
    });
  }, [socket, token, SetUnSeenMessageList, user]);
  return (
    <div>
      <div className={Style.NavBar}>
        <div className={Style.NavBarLeft}>
          <Link to={`/user/${user._id}`} className={Style.NavBarLeftLogo}>
            <Avatar
              src={logo}
              sx={{ width: 40, heigth: 40 }}
              className={Style.Avatar}
            />
          </Link>
        </div>
        <div className={Style.NavBarCenter}>
          <form className={Style.NavBarCenterSearch}>
            {!isloading ? (
              <label htmlFor="Search">
                <SearchIcon className={Style.NavBarCenterSearchIcon} />
              </label>
            ) : (
              <CircularProgress size={15} />
            )}
            <button
              onClick={searchHandlerSubmit}
              id="Search"
              style={{ display: "none" }}
            >
              Submit
            </button>
            <input
              placeholder="Search New Friends"
              onChange={searchHandler}
              type="text"
              value={search}
              onFocus={() => setShowSearch(true)}
            />
          </form>

          {showSearch && (
            <ul className={Style.SearchList}>
              <div className={Style.OverLay} onClick={BlurHandler}></div>
              {SearchList.map((USER) => {
                return (
                  <li
                    key={USER._id}
                    className={Style.NotificationInf}
                    onClick={BlurHandler}
                  >
                    <Link to={`/profile/${USER._id}`}>
                      <Avatar
                        src={USER.profilePicture}
                        alt="CreatorProfilePicture"
                        size={20}
                        className={Style.AvatarSearch}
                      />
                    </Link>
                    <div className={Style.NotificationRight}>
                      <Link to={`/profile/${USER._id}`}>
                        <h4>{USER.userName}</h4>
                      </Link>
                    </div>
                  </li>
                );
              })}
              {SearchList.length <= 0 && search && (
                <p className={Style.SearchMessage}>Can`t find UserName </p>
              )}
              {!search && (
                <p className={Style.SearchMessage}>Start typing to Search</p>
              )}
            </ul>
          )}
        </div>
        <div className={Style.NavBarRight}>
          <div className={Style.NavBarRightLink}>
            <NavLink
              className={Style.NavBarRightLinkLink}
              to={`/profile/${user._id}`}
              activeClassName={Style.ActiveLink}
            >
              <AccountBoxIcon className={Style.BadgeIcon} />
            </NavLink>
            <NavLink
              className={Style.NavBarRightLinkLink}
              to={`/user/${user._id}`}
              activeClassName={Style.ActiveLink}
            >
              <HomeIcon className={Style.BadgeIcon} />
            </NavLink>
          </div>
          <div className={Style.NavBarRightNotification}>
            <Badge color="error" badgeContent={unSeenMessageList?.length}>
              <NavLink
                to={`/${user._id}/messenger`}
                activeClassName={Style.ActiveLink}
                className={Style.NavBarRightLinkLink}
              >
                <MailIcon className={Style.BadgeIcon} />
              </NavLink>
            </Badge>
            <IconButton onClick={ToggleFriendRequest}>
              <Badge
                max={99}
                badgeContent={requestsList?.length}
                color="error"
                className={Style.Badge}
              >
                <GroupAddIcon className={Style.BadgeIcon} />
              </Badge>
            </IconButton>
          </div>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            className={Style.ShowButton}
          >
            <MenuIcon />
          </IconButton> */}
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: .5 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{ width: 40, height: 40 }}
                    className={Style.AvatarRightTop}
                    src={user.profilePicture}
                  />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "center", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
              <Link to={`/profile/${user._id}`}>
                <MenuItem>
                  <Avatar src={user.profilePicture} /> Profile
                </MenuItem>
              </Link>
              <Divider />
              {/* <MenuItem>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem> */}
              <Link to={`/${user._id}/changepassword`}>
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                ChangePassword
              </MenuItem>
              </Link>
              <Link to="/login">
                <MenuItem onClick={logoutHandler}>
                  <Logout fontSize="small" />
                  Logout
                </MenuItem>
              </Link>
            </Menu>
          </React.Fragment>
        </div>
      </div>
      {showFriendRequest && (
        <ul className={Style.friendrequestList}>
          {requestsList.map((request) => {
            return (
              <li key={request._id} className={Style.Notification}>
                <div className={Style.NotificationInf}>
                  <Link to={`/profile/${request.creatorId}`}>
                    <Avatar
                      src={request.creatorProfilePicture}
                      alt="CreatorProfilePicture"
                      size={20}
                      className={Style.Avatar}
                    />
                  </Link>
                  <div className={Style.NotificationRight}>
                    <Link to={`/profile/${request.creatorId}`}>
                      <h4>{request.creatorUserName}</h4>
                    </Link>
                    <p>{format(request.Date)}</p>
                  </div>
                </div>
                <div className={Style.NotificationButtons}>
                  <button onClick={() => FriendHandler(request.creatorId)}>
                    Accept
                  </button>
                  <button
                    onClick={() => FriendCancelHandler(request.creatorId)}
                  >
                    Cancel
                  </button>
                </div>
              </li>
            );
          })}
          {requestsList.length <= 0 && (
            <p className={Style.friendrequestListMessage}>No Friend Request</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default TopBar;
