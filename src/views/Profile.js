import React, {useState, useEffect} from 'react'
import {Avatar, Grid} from '@material-ui/core';
import '../assets/css/profile.css'
import AddIcon from '@material-ui/icons/AddCircle';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { db } from '../store/firebase';
import ViewPost from '../components/modals/ViewPost'
import NewPost from '../components/CreatePost'
import EditPost from '../components/modals/EditUser'

function Profile() {
  const photoUrl = localStorage.getItem('userPhotoUrl');
  const username = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  const userUID = localStorage.getItem('userUID');

  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState({})
  const [open, setOpen] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const handleClickOpen = (id) => {
    setOpen(true);
    const selected = posts.filter(post => {return post.id === id})
    setSelectedPosts(selected[0])
  };
  const handleClickOpenPost = (id) => {
    setOpenPost(true);
  };

  const handleClickOpenProfile = (id) => {
    setOpenProfile(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleClosePost = ()=> {
       setOpenPost(false)
  };

  
  useEffect(() => {
    const getPost = () => {
      const newPost  = [];
      db.collection('posts')
        .where("userUID", "==",userUID)
        .onSnapshot(snapshot => {
          newPost.push(snapshot.docs.map(doc =>{
               return ({ post: doc.data(), id: doc.id})
            }))   
        }) 
      return {newPost}; 
    }
    let {newPost} = getPost();
     
     setPosts(newPost)
 }, [userUID])

    return (
        <div className="profile">
          <div className="profile__header">
              <div>
                <Avatar className="profile__avatar" src={photoUrl}  alt={username}/>
              </div>
              <div className="profile__info">
                  <h2>{username}</h2>
                  <h6> <strong> {email}</strong></h6>
                  <button onClick={handleClickOpenProfile}>Edit Profile</button>
              </div>
          </div>
          <EditPost open={openProfile} handleClose={handleCloseProfile}/>

          <div className="profile__imagesContainer">
              <div className="profile__addPost">
                  <h3>My Posts</h3>
                  <button className="add__button" onClick={handleClickOpenPost}><AddIcon/> Add Post</button>
              </div>
             <NewPost posts={selectedPosts} open={openPost} handleClose={handleClosePost}/>
              <Grid container spacing={3}>
                  {posts && posts.map(post => {
                      return(
                        <Grid onClick={handleClickOpen(post.id)} key={post.id} item x2={12} sm={4} md={3} className="profile__imageContainer">
                        <img className="profile__image" src={post.post.imageUrl} alt="my post"></img> 
                        <div className="img__icons">
                            <span className="icon"> {post.post.likes}<FavoriteBorderIcon/></span>
                            <span  className="icon"><WhatsAppIcon/></span>
                       </div> 
                     </Grid>
                      )
                      
                  })}
                  <ViewPost open={open} handleClose={handleClose}/>
               </Grid>
             
          </div>
        
        </div>
    )
}

export default Profile
