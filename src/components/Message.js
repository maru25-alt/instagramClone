import React from 'react'
import moment from 'moment'
const currentUserUID = localStorage.getItem('userUID');


function Message({message}) {
    return (
        <div className={currentUserUID === message.senderId ? "message message__receiver" : "message"}>
         <span>{message?.message}</span>
         <span className="message__timestamp"> { moment(message.sendAt?.toDate()).format('MMMM Do, h:mm a')}</span>
   </div>
    )
}

export default Message
