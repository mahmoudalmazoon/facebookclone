import React from "react";
import Style from "./ActiveFriend.module.css";
import { Avatar } from "@mui/material";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
const ActiveFriend = ({ ActivePhoto, friendName }) => {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  return (
    <div className={Style.ActiveFriend}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        variant="dot"
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
          }}
          alt="Remy Sharp"
          src={ActivePhoto}
          className={Style.Avatar}
        />
      </StyledBadge>
      <p className={Style.ActiveFriendName}>{friendName}</p>
    </div>
  );
};

export default ActiveFriend;
