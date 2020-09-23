import React, {useState, useEffect} from 'react'
import '../assets/css/posts.css'
import {Avatar} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TelegramIcon from '@material-ui/icons/Telegram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Comment from './Comment'
import { db } from '../store/firebase';
import AddComment from './CreateComment';
import moment from 'moment';
import FullAddComment from './FullAddComment'

function Post({post, id}) {
    const {imageUrl, username, caption,createdAt, userPhotoUrl,  likes} = post;
    const [comments, setComments] = useState([])
    const [like, setLike] = useState(false)
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    
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
              <Avatar
              className="post__avatar"
              src={userPhotoUrl}
              alt={username} />
              <h3>{username}</h3>
          </div>
          {/* image */}
          <img
           className="post__image"
           src={imageUrl}  
           alt="post"/>

          {/* likes */}
          <div className="buttons__section">
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
        </div>
    )
}

export default Post
