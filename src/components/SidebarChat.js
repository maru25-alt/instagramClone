import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import { IconButton, Avatar} from '@material-ui/core';
import BarChat from './BarChat'
import { db} from '../store/firebase';
import { useState, useEffect } from 'react';

function SidebarChat() {
    const [users, setusers] = useState([])

    useEffect(() => {
       db.collection('users')
       .onSnapshot(snapshot => {
           setusers(snapshot.docs.map(doc => {
               return {id: doc.id, ...doc.data()}
           }))
       })

    })

   
    return (
        <div className="sidebar">
            <div className="sidebar__header">
               <h3>Username</h3>
                <div className="header__icons">
                    <IconButton>
                        <VideocamOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <OpenInNewIcon/>
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="search__container">
                 <SearchIcon/>
                 <input  placeholder="search or start new" type="text"></input>
                </div>
            </div>
            <div className="sidebar__chats">
                {users && users.map(user => {
                    return (<BarChat key={user.id} user={user}/>)
                })}
                
            </div>
        </div>
    )
}

export default SidebarChat
