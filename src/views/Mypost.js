import React, {useState, useEffect} from 'react';
import Post from '../components/Post'
import { db } from '../store/firebase';
import '../assets/css/mypost.css'

function Mypost() {
    const [posts, setPosts] = useState([]);
    const username = localStorage.getItem('userName')
    useEffect(() => {
        const userUID = localStorage.getItem('userUID');
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
          })  
        }
        getData();    
     }, [])
     console.log(posts)
    return (
        <div className="posts">
            <h4>{username} Posts</h4>
            <br></br>
            {posts && posts.map(post => {
                 return( 
                    <Post 
                    key={post.id}
                    post = {post.post}
                    id = {post.id}
                    />
                )
            })} 
        </div>
    )
}

export default Mypost
