import React, {useState, useEffect} from 'react'
import {Avatar} from '@material-ui/core';
import '../assets/css/profile.css'
import AddIcon from '@material-ui/icons/Add';
import { db } from '../store/firebase';
import NewPost from '../components/CreatePost';
import {useHistory} from 'react-router-dom';
import Posts from '../components/ProfilePosts';
import Loading from '../components/Loading';

const photoUrl = localStorage.getItem('userPhotoUrl');
const username = localStorage.getItem('userName');
const email = localStorage.getItem('userEmail');
const userUID = localStorage.getItem('userUID');


function Profile() {
  
  const history = useHistory();

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false)

 
  const handleClose = () => {
    setOpen(false);
  };

 
  useEffect(() => {
    setloading(true)
    const getData = async () => {
      await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .where("userUID" , "==", userUID)
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc =>
           ({
             post: doc.data(),
             id: doc.id
            })
        ))
        setloading(false)  
      })  
    }
    getData();  
 }, [])
 
 
    return (
        <div className="profile">
          <div className="profile__header">
              <div>
                <Avatar style={{ width: "70px" , height: "70px"}} src={photoUrl}  alt={username}/>
              </div>
              <div className="profile__info">
                  <h4>{username}</h4>
                  <h6> <strong> {email}</strong></h6>
                  <div  className="profile__buttons">
                      <button className="editProfile__button" onClick={() => history.push('/editProfile')}>Edit Profile</button>
                      <NewPost open={open} handleClose={handleClose}/>
                      <button className="add__button" onClick={() => setOpen(true)}><AddIcon/></button>
                  </div>
                 
              </div>
          </div>
          <div className="profile__imagesContainer">
               {loading ? <Loading/> :
              <> {posts.length  === 0 ? <div>No posts yet </div>  :  <Posts posts={posts}/>}</>
               }
          </div>
        
        </div>
    )
}

export default Profile
