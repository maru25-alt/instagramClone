import React, {useState, useEffect} from 'react'
import '../assets/css/posts.css'
import {Avatar} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TelegramIcon from '@material-ui/icons/Telegram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Comment from './Comment'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { db } from '../store/firebase';
import AddComment from './CreateComment';
import moment from 'moment';
import FullAddComment from './FullAddComment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

function Post({post, id}) {
    const {imageUrl, username, caption,createdAt, userPhotoUrl,  likes, userUID} = post;
    const [comments, setComments] = useState([])
    const [like, setLike] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const currentUserUID = localStorage.getItem('userUID');

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleOpenMenu = (event) => {
      console.log("clicked")
      setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
      setAnchorEl(null);
    }

    const handleDelete = () => {
      db.collection('posts').doc(id).delete().then(() => {
         console.log("deleted")
         setAnchorEl(null);
      })
     
    }
    
    
    const addLike = () => {
        setLike(!like);
        db.collection('posts')
        .doc(id)
        .get()
        .then(doc =>{ 
           const likes =  doc.data().likes;
           // console.log(doc.data())
          console.log(like)
          if(like){
            db.collection('posts').doc(id).update({likes:likes - 1})
          }
          else{
            db.collection('posts').doc(id).update({likes:likes + 1})
          }
           
        })
       
    }

    useEffect(()=> {
        let unsubscribe
        if(id){
           unsubscribe =  db.collection('posts')
            .doc(id)
            .collection("comments")
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => {
                  // const {senderName, createdAt, comment, senderId} = doc.data();
                  return  { ...doc.data() ,id: doc.id}
                }))
              //  setLikesNum(docs.data().likes)
            })
       }
       return() =>{
           unsubscribe();
       }
     }, [id, like])
    return (
        <div className="post">
          {/* header   */}
          <div className="post__header">
            <div className="post__headerLeft">
              <Avatar
                className="post__avatar"
                src={userPhotoUrl}
                alt={username} />
                <h3>{username}</h3>
            </div>
            <div>
              <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenMenu}>
                  <MoreHorizIcon/>
              </IconButton>
            </div>

          </div>
          {/* image */}
          <img
           className="post__image"
           src={imageUrl}  
           alt="post"/>

          {/* likes */}
          <div className="buttons__section">
            <div className="buttons__sectionLeft">
              <IconButton onClick={addLike}>
                 {like ? <FavoriteIcon/> : <FavoriteBorderIcon/>} 
              </IconButton>
              <IconButton onClick={handleClickOpen}>
                 <WhatsAppIcon/>
              </IconButton>
              <IconButton>
                  <TelegramIcon/>
              </IconButton>
            </div>
              <div>
                <IconButton >
                  <BookmarkBorderIcon></BookmarkBorderIcon>
                </IconButton>
              </div> 
          </div>
          <FullAddComment open={open} handleClose={handleClose} postId={id}/>
          {/* username */}
            <div className="comments__section">
                <h6><strong>{likes} likes</strong></h6>
                <h6 className="post__date">{createdAt && moment(createdAt.toDate()).fromNow() }</h6>
                <p className="post__text"> {caption}</p>
                <h6 className="post__date">{comments.length} Comments</h6>
               { id && <AddComment postId={id}/>}
                <div className="comments__container">
                    {comments && comments.map(e => {
                        return <Comment key={e.id}  commentText={e} />
                    })}
                </div>
                
           </div>


           <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {currentUserUID === userUID && <MenuItem onClick={handleDelete} className="delete__button">Delete</MenuItem>}
                <MenuItem onClick={handleMenuClose}>Copy Link</MenuItem>
                <MenuItem onClick={handleMenuClose}>Share to</MenuItem>
                <MenuItem onClick={handleMenuClose}>Mute</MenuItem>
                <MenuItem onClick={handleMenuClose}>Cancel</MenuItem>
              </Menu>
        </div>
    )
}

export default Post
