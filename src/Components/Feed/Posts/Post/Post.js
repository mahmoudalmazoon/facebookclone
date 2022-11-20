import { Card, Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, { Fragment, useState } from "react";
import Style from "./Post.module.css";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import Shared from "../../Shared/Shared";
const Post = ({ post, creator, socket, activeList, updatePost }) => {
  const { user } = useSelector((state) => state.user);
  const [Likes, setLikes] = useState(+post.likes.length + +post.loves.length);
  const [isLike, setIsLike] = useState(post.likes.includes(user._id));
  const [isLove, setIsLove] = useState(post.loves.includes(user._id));
  const [commentEntered, SetCommentEnterd] = useState("");
  const [postComments, SetPostComments] = useState(post.comments);
  const [UpdatedShow, SetUpdatedShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const token = window.sessionStorage.getItem("token");
  const LikeHandler = async () => {
    setIsLike((prevState) => !prevState);
    setLikes((prevState) =>
      !isLove ? (!isLike ? +prevState + 1 : +prevState - 1) : prevState
    );
    setIsLove(false);
    try {
      const res = await axios.put(
        `https://zonabookapi.herokuapp.com/api/post/${post._id}/like`,
        { creatorLikeId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.current.emit(
        "updatePost",
        "likes",
        { loves: res.data.loves, likes: res.data.likes },
        post,
        activeList
      );
    } catch (error) {
      console.log(error);
    }
  };
  const loveHandler = async () => {
    setIsLove((prevState) => !prevState);
    setLikes((prevState) =>
      !isLike ? (!isLove ? +prevState + 1 : +prevState - 1) : prevState
    );
    setIsLike(false);
    try {
      const res = await axios.put(
        `https://zonabookapi.herokuapp.com/api/post/${post._id}/love`,
        {
          creatorLoveId: user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.current.emit(
        "updatePost",
        "loves",
        { loves: res.data.loves, likes: res.data.likes },
        post,
        activeList
      );
    } catch (error) {
      console.log(error);
    }
  };
  const commentHandler = (e) => {
    SetCommentEnterd(e.target.value);
  };
  const sendCommentHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://zonabookapi.herokuapp.com/api/post/comment/${post._id}/${user._id}`,
        {
          comment: commentEntered,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      SetPostComments((prevState) => [res.data.data, ...prevState]);
      socket.current.emit(
        "updatePost",
        "comments",
        res.data.data,
        post,
        activeList
      );
    } catch (error) {
      console.log(error);
    }
    SetCommentEnterd("");
  };
  useEffect(() => {
    if (updatePost.post?._id === post._id) {
      if (updatePost.updated === "comments") {
        SetPostComments((prevState) => [
          ...updatePost.post.comments,
          ...prevState,
        ]);
      }
      if (updatePost.updated === "likes") {
        console.log("likes");

        setLikes(+updatePost.post.likes.length + +updatePost.post.loves.length);
      }
      if (updatePost.updated === "loves") {
        console.log("loves");
        console.log(updatePost.post.loves);
        console.log(updatePost.post.likes);
        setLikes(+updatePost.post.likes.length + +updatePost.post.loves.length);
      }
    }
  }, [updatePost, post]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const UpdatedToggle = () => {
    SetUpdatedShow((prevState) => !prevState);
  };
  const updateHandler = () => {
    setAnchorEl(null);
    UpdatedToggle();
  };
  const deleteHandler = async () => {
    setAnchorEl(null);
    await axios.delete(`https://zonabookapi.herokuapp.com/api/post/${post._id}/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    socket.current.emit("DeletePost", post, activeList);
  };
  return (
    <Card className={Style.PostCard}>
      <div className={Style.PostTop}>
        <div className={Style.PostInf}>
          <Link to={`/profile/${creator._id}`}>
            <Avatar
              className={Style.Avatarpost}
              src={
                creator._id === user._id
                  ? user.profilePicture
                  : creator.profilePicture
              }
              alt="CreatorProfilePicture"
            />
          </Link>
          <div className={Style.PostTopDes}>
            <Link to={`/profile/${creator._id}`}>
              <h4>{creator.userName}</h4>
            </Link>
            <p>{format(post.createdAt)}</p>
          </div>
        </div>
        {user._id === creator._id && (
          <Fragment>
            <IconButton
              aria-label="settings"
              onClick={handleClick}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {/* <MenuItem onClick={updateHandler}>
                Update <SyncAltIcon />
              </MenuItem> */}
              <MenuItem onClick={deleteHandler}>
                Delete
                <DeleteForeverIcon />
              </MenuItem>
            </Menu>
          </Fragment>
        )}
      </div>
      <div className={Style.Postdes}>{post.des}</div>
      {post.img && (
        <img className={Style.Postimage} src={post.img} alt="postImage" />
      )}
      <div className={Style.PostBotttom}>
        <div className={Style.PostBotttomAction}>
          <div className={Style.postBottomLeft}>
            <img
              className={isLike ? Style.Scale : Style.likeIcon}
              onClick={LikeHandler}
              src={post.LikeImg}
              alt="LikeImg"
            />
            <img
              className={isLove ? Style.Scale : Style.likeIcon}
              onClick={loveHandler}
              src={post.LoveImg}
              alt="LoveImg"
            />
            <span className={Style.postLikeCounter}>{Likes} like it</span>
          </div>
          <div className={Style.postBottomRight}>
            <span className={Style.postCommentText}>
              {postComments.length} comments
            </span>
          </div>
        </div>
        <form className={Style.PostBotttomComment}>
          <Avatar
            className={Style.AvatarComments}
            src={user.profilePicture}
            alt="user.profilePicture"
          />
          <input
            type="text"
            placeholder="Add Your comment"
            value={commentEntered}
            onChange={commentHandler}
          />
          {commentEntered && (
            <button
              className={Style.CommentButton}
              onClick={sendCommentHandler}
            >
              <SendRoundedIcon sx={{ fontSize: 20 }} color="inhert" />
            </button>
          )}
        </form>
        <ul className={Style.CommentsList}>
          {postComments.map((postComment) => {
            return (
              <Card className={Style.Comment} key={postComment._id}>
                <div className={Style.CommentTopDes}>
                  <Link to={`/profile/${postComment.creatorId}`}>
                    <Avatar
                      className={Style.AvatarComments}
                      src={postComment.creatorProfilePicture}
                      alt="CreatorProfilePicture"
                    />
                  </Link>
                  <div className={Style.commentinfo}>
                    <Link to={`/profile/${postComment.creatorId}`}>
                      <h5>{postComment.creatorUserName}</h5>
                    </Link>
                    <p>{format(postComment.Date)}</p>
                  </div>
                </div>
                <h4 className={Style.CommentMessage}>{postComment.comment}</h4>
              </Card>
            );
          })}
        </ul>
      </div>
      {UpdatedShow && (
        <Fragment>
          <div className={Style.UpdateOverLay} onClick={UpdatedToggle}></div>
          <div className={Style.UpdateComponent}>
            <Shared post={post} />
          </div>
        </Fragment>
      )}
    </Card>
  );
};

export default Post;
