import { useEffect, useState, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login/Login";
import Forget from "./pages/Auth/Forget/Forget";
import SignUp from "./pages/Auth/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import { login } from "./Redux/user";
import Messenger from "./pages/Messenger/Messenger";
import axios from "axios";
import { io } from "socket.io-client";
import TopBar from "./Components/TopBar/TopBar";
import ResetPassword from "./pages/Auth/ResetPassword/ResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword/ChangePassword";
const App = () => {
  const { user } = useSelector((state) => state.user);
  const [Friends, SetFriends] = useState([]);
  const [activeList, setactiveList] = useState([]);
  const dispatch = useDispatch();
  const socket = useRef();
  const [arrivalMessage, SetarrivalMessage] = useState("");
  const [arrivalPost, SetarrivalPost] = useState("");
  const [updatePost, setUpdatePost] = useState("");
  const token = window.sessionStorage.getItem("token");
  const [unSeenMessageList,SetUnSeenMessageList] = useState([])
  useEffect(() => {
    socket.current = io("ws:http://localhost:8900/");
    socket.current.on("getMessage", (data) => {
      console.log("getMessage")
      SetarrivalMessage({
        senderId: data.senderId,
        createdAt: Date.now(),
        text: data.text,
        profilePicture: data.profilePicture,
        _id: data._id,
      });
    });
  }, []);
  useEffect(() => {
    socket.current.on("getPost", (data) => {
      SetarrivalPost(data);
    });
  }, []);
  useEffect(() => {
    socket.current.on("getUpdatePost", (post, updated) => {
      setUpdatePost({
        post: post,
        updated: updated,
      });
    });
  }, []);

  // useEffect(() => {
  //   socket.current.on("getFreiendRequest", async () => {
  //     const result = await axios.get(
  //       `https://zonabookapi.herokuapp.com/api/user/${user?._id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     window.sessionStorage.setItem("user", JSON.stringify(result.data.user));
  //     dispatch(login(result.data.user));
  //     setUpdate(result.data.user);
  //   });
  // }, [dispatch, user?._id,token]);
  useEffect(() => {
    if (window.sessionStorage.getItem("user")) {
      dispatch(login(JSON.parse(window.sessionStorage.getItem("user"))));
    }
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      const fetchfriends = async () => {
        const result = await axios.get(
          `https://zonabookapi.herokuapp.com/api/user/users/${user?._id}/friends`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        SetFriends(result.data.friends);
      };
      fetchfriends();
    }
  }, [user, token]);
  useEffect(() => {
    if (token) {
      const fetchUnSeen = async () => {
        const result = await axios.get(
          `https://zonabookapi.herokuapp.com/api/message/unSeen/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        SetUnSeenMessageList(result.data.unSeen);
      };
      fetchUnSeen();
    }
  }, [user, token]);
  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user);
      socket.current.on("getUsers", async (users) => {
        const res = await axios.post(
          `https://zonabookapi.herokuapp.com/api/user/activeFriends`,
          {
            friends: user.friends.filter((f) =>
              users.some((u) => u.userId === f)
            ),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setactiveList(res.data.activeFriends);
      });
    }
  }, [user, token]);
  return (
    <Fragment> 
      {user && <TopBar socket={socket} SetUnSeenMessageList={SetUnSeenMessageList} unSeenMessageList={unSeenMessageList} />}
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/forget" exact>
          <Forget />
        </Route>
        <Route path="/:userId/messenger" exact>
          {user ? (
            <Messenger
              socket={socket}
              activeList={activeList}
              Friends={Friends}
              arrivalMessage={arrivalMessage}
            />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/:userId/changepassword" exact>
          {user ? (
              <ChangePassword />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/login" exact>
          {user ? <Redirect to={`/profile/${user._id}`} /> : <Login />}
        </Route>
        <Route path="/signUp" exact>
          {user ? <Redirect to={`/profile/${user._id}`} /> : <SignUp />}
        </Route>
        <Route path="/resetpassword/:token/:userId" exact>
          <ResetPassword />
        </Route>
        <Route path={`/user/:userId`} exact>
          {!user ? (
            <Redirect to={`/login`} />
          ) : (
            <Home
              updatePost={updatePost}
              socket={socket}
              arrivalPost={arrivalPost}
              activeList={activeList}
              Friends={Friends}
            />
          )}
        </Route>
        <Route path="/profile/:userId" exact>
          {!user ? (
            <Redirect to={`/login`} />
          ) : (
            <Profile
              updatePost={updatePost}
              socket={socket}
              arrivalPost={arrivalPost}
              activeList={activeList}
              Friends={Friends}
            />
          )}
        </Route>
      </Switch>
    </Fragment>
  );
};
export default App;
