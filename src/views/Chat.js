import React from 'react'
import SidebarChat from '../components/SidebarChat';
import ChatMessages from '../components/Chat';
import '../assets/css/chat.css'
import DefaultChatValue from '../components/DefaultChatValue'
import {
    Switch,
    Route,
    Redirect
  } from "react-router-dom";

function Chat() {
    return (
        <div className="chat">
            <div className="chatContainer">
              <SidebarChat/>
              <Switch>
                <Route  path="/chat/:id" render={(props) => (<ChatMessages {...props} />)}/>
                <Route path="/chat"  component={DefaultChatValue}/>
                <Redirect from="/chat"  to="/"/> 
              </Switch>
            </div>  
        </div>
    )
}

export default Chat
