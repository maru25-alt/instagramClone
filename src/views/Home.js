import React, { useEffect } from 'react'
import Posts from '../components/Posts';
import { useHistory } from "react-router-dom";

function Home() {

    let history = useHistory();
    useEffect(() => {
        if(!localStorage.getItem("userUID")){
            history.push("/signin");
          }
    }, [history])
    return (
        <div className="home">
           
            {/* posts */}
            <Posts/>
        </div>
    )
}

export default Home
