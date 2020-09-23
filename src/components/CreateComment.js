import React, { useState, useEffect } from 'react'
import { db, firebase } from '../store/firebase';

export default function CreateComment({postId}) {

    const [comment, setComment] = useState("");
    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    useEffect(() => {
        let checkDisabled = () =>{
            if(comment !== ""){
                setDisabled(false)
            } 
            
        }
        return () => {
            checkDisabled()
        }
    }, [comment])
    
    const postComment = (e) =>{
        e.preventDefault();
        if(comment !== ""){
            const username = localStorage.getItem('userName');
            const userUID = localStorage.getItem('userUID')
            const  createdAt= firebase.firestore.FieldValue.serverTimestamp();
            db.collection('posts').doc(postId).collection('comments').add({
                senderName: username,
                createdAt: createdAt,
                comment: comment,
                senderId: userUID
            }).then(e => {
                setComment("");
                setDisabled("true")
                
            })
        }  
    }

    return (
        <div>
            <form className="create__commentForm">
                <textarea onChange={handleChange} value={comment} name="comment" className="create__commentTextarea" placeholder="Add a comment"></textarea>
                <button disabled={disabled} onClick={postComment} className="create__commentButton">Post</button>
            </form>
        </div>
    )
}
