import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/header.css'
import HomeIcon from '@material-ui/icons/Home';
import TelegramIcon from '@material-ui/icons/Telegram';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {Avatar} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { auth } from '../store/firebase';
import {useHistory} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import CreatePost from './CreatePost'

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const photoUrl = localStorage.getItem('userPhotoUrl')
  const username = localStorage.getItem('userName');
  const userID = localStorage.getItem('userUID')

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseCreatePost = () => {
    setOpen(false);
  };
  let history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      history.push(`/profile/${username}/${userID}`)
      setAnchorEl(null);
  }


  const handleLogOut = () => {
      auth.signOut().then(() =>{
          localStorage.clear();
           setAnchorEl(null);
           history.push('/signin')
      })
  }

  
    return (
        <div className="header">
            <div className="header__imageContainer">
            <img
            className="header__image"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
            alt="logo"/>
         </div>
            <div className="header__linksContainer">
                <Tooltip title="home"  placement="bottom">
                    <Link to="/">
                        <HomeIcon/>
                    </Link>
                </Tooltip>
                <Tooltip title="chat"  placement="bottom">
                    <Link to="/chat">
                        <TelegramIcon/>
                    </Link>
                </Tooltip>
                
                <Tooltip title="account activities" placement="bottom">
                    <Link to="/">
                        <FavoriteBorderIcon/>
                    </Link>
                </Tooltip>
                <Tooltip title="add new post"  placement="bottom">
                    <span onClick={handleOpen}>
                        <AddCircleIcon/>
                    </span>
                </Tooltip>
                <CreatePost  handleClose={handleCloseCreatePost} open={open}/>
                <Avatar 
                className="avatar" 
                src={photoUrl} 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={handleClick} 
                alt={username?.toUpperCase()}/>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                   
                    <MenuItem onClick={ handleLogOut}>Logout</MenuItem>
                </Menu>

            </div>
           
           
            
        </div>
    )
}
