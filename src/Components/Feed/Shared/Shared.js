import React, { useState } from "react";
import Style from "./Shared.module.css";
import { Avatar, Card } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { CardActionArea } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { PermMedia, Label, Room, EmojiEmotions } from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
const Shared = ({ SetPosts, socket, activeList, post }) => {
  const { user } = useSelector((state) => state.user);
  const [file, setfile] = useState("");
  const uploadImageHandler = (e) => {
    setfile(e.target.files[0]);
  };
  const [desc, setdes] = useState(post ? post.des : "");
  const token = window.sessionStorage.getItem("token");
  const submitPostHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      creatorId: user._id,
      des: desc,
    };
    if (file) {
      const data = new FormData();
      const addingName = `https://zonabookapi.herokuapp.com/api/images/${Date.now().toString()}`;
      const FileNameyUnique = addingName + file.name;
      newPost.img = FileNameyUnique;
      data.append("file", file, FileNameyUnique);
      newPost.img = FileNameyUnique;
      try {
        await axios.post("https://zonabookapi.herokuapp.com/api/upload", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.log(error);
      }
      setfile("");
    }
    setdes("");
    try {
      const post = await axios.post(
        "https://zonabookapi.herokuapp.com/api/post/addpost",
        newPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      SetPosts((prev) => [post.data.data, ...prev]);
      post && socket.current.emit("AddPost", post.data.data, activeList);
    } catch (error) {
      console.log(error);
    }
  };
  const CancelUpload = () => {
    setfile("");
  };
  const updateHandler = async (e) => {
    e.preventDefault();
    const { img,creatorId} = post;
    const updatePost = {
      creatorId:creatorId,
      img: img,
      des: desc,
    };
    if (file) {
      const data = new FormData();
      const addingName = `https://zonabookapi.herokuapp.com/api/images/${Date.now().toString()}`;
      const FileNameyUnique = addingName + file.name;
      updatePost.img = FileNameyUnique;
      data.append("file", file, FileNameyUnique);
      updatePost.img = FileNameyUnique;
      try {
        await axios.post("https://zonabookapi.herokuapp.com/api/upload", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.log(error);
      }
      setfile("");
    }
    setdes("");
    try {
      const res = await axios.put(
        `https://zonabookapi.herokuapp.com/api/post/${post?._id}`,
        {
          updatePost: updatePost,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className={Style.Card}>
      <div className={Style.shareTop}>
        <Avatar  className={Style.shareTopAvatar} src={user.profilePicture} alt="profilePicture" />
        <input
          type="text"
          placeholder={`what's in your mind ${user.userName} `}
          onChange={(e) => setdes(e.target.value)}
          value={desc}
        />
      </div>

      <hr className={Style.hr} />
      <div>
        <form className={Style.shareBottom}>
          <div className={Style.shareOptions}>
            <label className={Style.shareOption}>
              <PermMedia htmlColor="tomato" className={Style.shareIcon} />
              <span className={Style.shareOptionText}>Photo/Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                onChange={uploadImageHandler}
              />
            </label>
            <div className={Style.shareOption}>
              <Label htmlColor="blue" className={Style.shareIcon} />
              <span className={Style.shareOptionText}>Tag</span>
            </div>
            <div className={Style.shareOption}>
              <Room htmlColor="green" className={Style.shareIcon} />
              <span className={Style.shareOptionText}>Location</span>
            </div>
            <div className={Style.shareOption}>
              <EmojiEmotions
                htmlColor="goldenrod"
                className={Style.shareIcon}
              />
              <span className={Style.shareOptionText}>Feelings</span>
            </div>
          </div>
          <button
            type="submit"
            className={Style.shareButton}
            onClick={post ? updateHandler : submitPostHandler}
          >
            <ShareIcon />
            <span>{post ? "Update" : "Share"} </span>
          </button>
        </form>
        {file || post?.img ? (
          <CardActionArea className={Style.SharePostContainer}>
            <button onClick={CancelUpload}>
              <HighlightOffOutlinedIcon />
              <span>Remove</span>
            </button>
            <CardMedia
              component="img"
              className={Style.Postimage}
              image={file ? URL.createObjectURL(file) : post?.img}
              alt="green iguana"
            />
          </CardActionArea>
        ) : null}
      </div>
    </Card>
  );
};

export default Shared;
