import React, {useState, useEffect} from 'react'
import {Avatar} from '@material-ui/core';
import '../assets/css/profile.css'
//import AddIcon from '@material-ui/icons/Add';
import { db } from '../store/firebase';
import NewPost from '../components/CreatePost';
import {useHistory, useParams} from 'react-router-dom';
import Posts from '../components/ProfilePosts';
import Loading from '../components/Loading';

// const photoUrl = localStorage.getItem('userPhotoUrl');
// const username = localStorage.getItem('userName');
// const email = localStorage.getItem('userEmail');
const userUID = localStorage.getItem('userUID');


function Profile() {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [user, setuser] = useState({})
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [isLoggedinUser, setisLoggedinUser] = useState(false)
  const { id} = useParams()
  console.log(id)
 
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
     if(userUID === id){
       setisLoggedinUser(true)
     }
  }, [id])

  useEffect(() => {
     db.collection('users')
      .doc(id)
      .get()
      .then(snap =>{
        console.log(snap.data())
          setuser(snap.data())
      })
      .catch(err => {
        console.log(err)
        alert("user not found")
        
      })
 }, [id])

 const sendmessage = () => {
   history.push(`/chat/${id}`)
 }
 
  useEffect(() => {
    setloading(true)
    const getData = async () => {
      await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .where("userUID" , "==", id)
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
 }, [id])
 
 
    return (
        <div className="profile">
          <div className="profile__header">
              <div>
                <Avatar style={{ width: "70px" , height: "70px"}} src={user?.photoUrl}  alt={user?.username}/>
              </div>
              <div className="profile__info">
                   <h4>{user?.username}</h4>
                  <h6> <strong> {user?.email}</strong></h6>
                  <div  className="profile__buttons">
                    {isLoggedinUser ? 
                      <>
                      <button className="editProfile__button" onClick={() => history.push('/editProfile')}>Edit Profile</button>
                      <NewPost open={open} handleClose={handleClose}/>
                      <button className="add__button" onClick={() => setOpen(true)}>Create Post</button>
                      </>
                     : 
                     <>
                     <button onClick={sendmessage}  className="editProfile__button">Message</button>
                     </>}
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
