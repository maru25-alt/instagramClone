import React , { useState, useEffect} from 'react';
import { IconButton, Avatar } from '@material-ui/core';
import MicNoneIcon from '@material-ui/icons/MicNone';
import Message from './Message'
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import loading from '../assets/img/loading.gif'
import { db, timestamp } from '../store/firebase';



function Chat({match}) {
    const [message, setMessage] = useState('');
    const [messages, setmessages] = useState([]);
    const [username, setusername] = useState("");
    const [profileUrl, setprofileUrl] = useState("");
    const [sendLoading, setsendLoading] = useState(false);
    const [messagesLoading, setmessagesLoading] = useState(false)
    const chatID = match.params.id;
    const currentUserUID = localStorage.getItem('userUID');

    useEffect(() => {
        setmessages([])
        setmessagesLoading(true)
       db.collection('chats') 
       .doc(currentUserUID)
       .collection('messages')
       .where("chatWith", "==", chatID)
       .orderBy("sendAt" , "asc")
       .onSnapshot(snapshot => {
           setmessages(snapshot.docs.map((doc) => {
               return {id : doc.id, ...doc.data()}
           }))
           setmessagesLoading(false)
       })
    }, [currentUserUID, chatID])

    useEffect(() => {
        setusername("");
        setprofileUrl("")
        db.collection('users')
        .doc(chatID)
        .get()
        .then(doc => {
            const user = doc.data()
            setusername(user.username);
            setprofileUrl(user.profileUrl)
        })
    }, [chatID])
    
   

    const sendMessage = (e) => {
          e.preventDefault();
          setsendLoading(true)
          if(message !== ''){
          db.collection('chats')
          .doc(currentUserUID)
          .collection('messages')
          .add({
              message,
              senderId: currentUserUID,
              sendAt: timestamp(),
              chatWith: chatID
          }).then( () => {
            if(currentUserUID  !== chatID){
            db.collection('chats')
            .doc(chatID)
            .collection('messages')
            .add({
                message,
                senderId: currentUserUID,
                sendAt: timestamp(),
                chatWith: currentUserUID
            }) 
          }
          setMessage('')
          setsendLoading(false)
        })
      }
    }
    return (
        <div className="chat__container">
            <div className="chat__header">
               <Avatar src={profileUrl} alt="profile"/>
               <div className="header__info">
               <h4>{username}</h4>
                 <p>Last seen...</p>
               </div>
               <div className="header__icons">
                   <IconButton>
                     <VideocamOutlinedIcon/>
                   </IconButton>
                   <IconButton>
                      <InfoOutlinedIcon/>
                   </IconButton>
               </div>
            </div>
            <div className="chat__body">
            {messagesLoading && <img src={loading} width="30" height="30" alt="sending..."></img>}
                { messages && messages.map(e => (
                     <Message key={e.id} message={e}/>
                ))}
            </div>
            <div className="chat__footer">
                <form className="chat__input" onSubmit={sendMessage}>
                    <CameraAltOutlinedIcon/>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message..."></input>
                    {sendLoading && <img src={loading} width="15" height="15" alt="sending..."></img>}
                </form>
                <div className="footer__icons">
                         <MicNoneIcon/>
                         <ImageOutlinedIcon/>
                        <SentimentVerySatisfiedIcon/>
                </div>
               
            </div>
        </div>
    )
}

export default Chat
