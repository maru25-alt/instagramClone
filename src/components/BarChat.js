import React from 'react'
import { Avatar } from '@material-ui/core'
import {NavLink} from 'react-router-dom'

function BarChat({user}) {
    return (
        <NavLink activeStyle={{ backgroundColor: '#cccccc'}} to={`/chat/${user?.id}`} className="sidebar__chat">
            <Avatar src={user?.photoUrl} alt="profile" />
            <div className="chat__info">
                <h2>{user?.username}</h2>
                <p>last message.....</p>
            </div>
        </NavLink>
    )
}

export default BarChat
