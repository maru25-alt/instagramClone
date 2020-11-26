import React from 'react'
import loadingGif from '../assets/img/Loading_icon.gif'

function Loading() {
    return (
        <div>
            <img src={loadingGif} alt="loading..."/>
        </div>
    )
}

export default Loading
