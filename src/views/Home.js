import React, { useEffect, useState } from 'react'
import Post from '../components/Post';
import Loading from '../components/Loading'
import '../assets/css/posts.css';
import {db} from '../store/firebase';
import { useHistory } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setloading] = useState(false)
    let history = useHistory();

    useEffect(()=> {
        setloading(true)
        db.collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => {
             return  { post: doc.data(),id: doc.id}
            }))
            setloading(false)
        })
     }, [])

    useEffect(() => {
        if(!localStorage.getItem("userUID")){
            history.push("/signin");
          }
    }, [history])

    return (
        <div className="home">
            
           <div className="posts">
            {loading && <Loading/>}
            {posts.map(post => {
                return( 
                    <Post 
                    key={post.id}
                    post = {post.post}
                    id = {post.id}
                    />
                )
            })}
            </div>
        </div>
    )
}

export default Home
