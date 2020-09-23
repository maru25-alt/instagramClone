import React from 'react'
import moment from 'moment'

export default function Comment({commentText}) {
    const {comment, createdAt, senderName} = commentText
    return (
     <>
            {commentText && <div className="comment">
                <p> {senderName &&<strong> @{senderName} </strong>} {comment}</p>
                <i className="comment__date">{ createdAt && moment(createdAt.toDate()).fromNow()}</i> 
            </div>}
      </>      
    )
}
