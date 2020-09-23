import React , {useEffect, useState} from 'react'
import Post from './Post'
import {db} from '../store/firebase'

function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(()=> {
       db.collection('posts')
       .orderBy('createdAt', 'desc')
       .onSnapshot(snapshot => {
           setPosts(snapshot.docs.map(doc => {
            return  { post: doc.data(),id: doc.id}
           }))
       })
    }, [])



    return (
        <div className="posts">
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
    )
}

export default Posts
