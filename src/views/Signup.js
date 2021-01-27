import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import '../assets/css/signin.css'
import { auth, db, provider } from '../store/firebase';
import { useHistory } from "react-router-dom";
import FacebookIcon from '@material-ui/icons/Facebook';

function Signup() {
     const [email, setEmail] = useState("");
     const [username, setUsername] = useState("")
     const [password, setPassword] = useState("")
     const [fullname, setFullname] = useState("")
    
     let history = useHistory();

     useEffect(() => {
        if(localStorage.getItem("userUID")){
          history.push("/");
        }
    }, [history])

     const handleChange = (e)=>{
        if(e.target.name === "username"){
            setUsername(e.target.value)
        }
        else if(e.target.name === "password"){
            setPassword(e.target.value)
        }
        else if(e.target.name === "fullname"){
            setFullname(e.target.value)
        }
        else if(e.target.name === "email"){
            setEmail(e.target.value)
        }
        else{
            return 0;
        }
   }

   const handleFacebookSignin = (e) => {
    auth.signInWithPopup(provider).then(result => {
        if (result) {
            var user = result.user;
            console.log(user);
            db.collection('users')
            .doc()
            .set({
                username: user?.username,
                userID: user.uid,
                photoURL: user.photoUrl
            })
          }
          // The signed-in user info.
    })
    .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        alert(errorCode)
        var errorMessage = error.message;
        console.log(errorMessage
            )
        // The email of the user's account used.
        var emai = error.email;
        console.log(emai)
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(credential)
        // ...
      });
    
}
   
    const handleSubmit  = (e) =>{
        e.preventDefault();
        if(email === "" || username === "" || password === "" || fullname === ""  ){
            return toast.error("all fields are required", {
                position: "top-center",
                hideProgressBar: false,
                closeOnClick: true,
                autoClose: false,
                pauseOnHover: true,
                progress: undefined,
                });
        }
        auth.createUserWithEmailAndPassword(email, password).then(res => {
            res.user.updateProfile({
                displayName: username
            })
            db.collection('users')
            .doc(res.user?.uid)
            .set({
                username: username,
                userID: res.user?.uid,
                email: email,
                photoURL: ""

            })
            localStorage.setItem('userUID', res.user?.uid);
            localStorage.setItem('userName', username);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhotoUrl', res.user.photoURL);
            history.push("/");
            toast.success("successfully signed up", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            console.log(res.user.uid)
        }).catch(err => {
            console.log(err.message)
            toast.error(err.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
    }
   

    return (
        <div>
            <div className="signin">
            <div className="signin__container">
            <div className="signin__formContainer">
                <img 
                className="signin__logo" 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" 
                alt="logo">
                </img>
                <h2 className="signup__text">Sign up to see photos and videos from your friends.</h2>

                <button onClick={handleFacebookSignin} className="signup__facebookLink"><FacebookIcon/> Signup with Facebook</button>
                <div className="signin__or-section">
                    <span className="line line1"> <hr></hr> </span>
                    <span>OR</span>
                    <span className="line line2">  <hr></hr></span>
                </div>
                <form className="signin__form">
                    <input onChange={handleChange} value={email} type="email" name="email" placeholder="Email" required/>
                    <input onChange={handleChange} value={fullname} type="text" name="fullname" placeholder="Full Name"/>
                    <input onChange={handleChange} value={username} type="text" name="username" placeholder="Username"/>
                    <input onChange={handleChange} value={password} type="password" name="password" placeholder="Password"/>
                    <button type="submit"  onClick={handleSubmit}>Signup</button>
                </form>
               
                <p className="signup__policyText">
                By <strong>signing up</strong> , you agree to  <strong>Terms</strong> . Learn how we collect, use and share your data in our <strong>Data Policy</strong>  and how we use cookies and similar technology in our <strong>Cookies Policy </strong> .
                </p>
                    
            </div>
            <div className="signin__signupContainer">
                <h5>Have an account? <a href="/signin" className="link">Log in</a></h5>
            </div>
            </div>
        </div>
            
        </div>
    )
}

export default Signup
