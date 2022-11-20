import React from "react";
import Post from "./Post/Post";
import Style from "./Posts.module.css";
import { CircularProgress } from "@mui/material";
const Posts = ({ isloading, Users, Posts, socket, activeList, updatePost }) => {
  return (
    <ul className={Style.PostsList}>
      {!isloading ? (
        Posts.map((post) => {
          const creator = Users.find((user) => user._id === post.creatorId);
          return (
            <Post
              updatePost={updatePost}
              activeList={activeList}
              socket={socket}
              key={post._id}
              post={post}
              creator={creator}
            />
          );
        })
      ) : (
        <CircularProgress size={100} className={Style.isloading} />
      )}
    </ul>
  );
};

export default Posts;
