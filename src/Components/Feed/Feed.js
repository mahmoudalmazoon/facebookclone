import React, { useEffect, useState } from "react";
import Posts from "./Posts/Posts";
import Style from "./Feed.module.css";
import Shared from "./Shared/Shared";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
const Feed = ({ socket, activeList, arrivalPost, updatePost, postsUser }) => {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.user);
  const [isloading, SetIsloading] = useState(false);
  const [posts, SetPosts] = useState([]);
  const [Users, SetUsers] = useState([]);
  const token = window.sessionStorage.getItem("token");
  useEffect(() => {
    SetPosts((prevState) => [arrivalPost, ...prevState]);
  }, [arrivalPost]);
  useEffect(() => {
    SetIsloading(true);
    const fetchposts = async () => {
      const posts = await axios.get(
        `https://zonabookapi.herokuapp.com/api/post/timeLine/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get("https://zonabookapi.herokuapp.com/api/user/Users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      SetPosts(
        postsUser && userId !== user._id
          ? postsUser.reverse()
          : posts.data.posts.reverse()
      );
      SetUsers(res.data.Users);
      SetIsloading(false);
    };
    fetchposts();
  }, [user, token, postsUser, userId]);
  useEffect(()=>{
    socket.current.on("DeleteOnePost",(data)=>{
      SetPosts(prevState=> prevState.filter((p)=>{
        return p._id !== data._id
      }))
    })
  },[socket])
  return (
    <div className={Style.Feed}>
      {userId === user._id && (
        <Shared socket={socket} SetPosts={SetPosts} activeList={activeList} />
      )}
      <Posts
        updatePost={updatePost}
        socket={socket}
        activeList={activeList}
        isloading={isloading}
        Posts={posts}
        Users={Users}
      />
    </div>
  );
};

export default Feed;
