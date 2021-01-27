import React, { useState , useEffect} from 'react'
import { toast } from 'react-toastify';
import '../assets/css/signin.css'
import { auth , provider} from '../store/firebase';
import { useHistory } from "react-router-dom";


function Signin() {
    
    const [email, setEmail] = useState("rudomapfumba@gmail.com");
    const [password, setPassword] = useState("qwe123456");

    let history = useHistory();

    useEffect(() => {
        if(localStorage.getItem("userUID")){
          history.push("/");
        }
    }, [history])
  
    const HandleChange = (e)=>{
         if(e.target.name === "email"){
             setEmail(e.target.value)
         }
         else if(e.target.name === "password"){
             setPassword(e.target.value)
         }
    }

    const handleFacebookSignin = (e) => {
        auth.signInWithPopup(provider).then(user => {
            console.log(user)
        })
    }
    
    const handleSignin = (e) => {
       e.preventDefault();
       if(email === "" || password === ""){
        return toast.error("fill in empty field", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            autoClose: false,
            pauseOnHover: true,
            progress: undefined,
            });
       }
       auth.signInWithEmailAndPassword(email, password).then((res)=>{
           if(res.user){
            localStorage.setItem('userUID', res.user.uid);
            localStorage.setItem('userName', res.user.displayName);
            localStorage.setItem('userPhotoUrl', res.user.photoURL);
            localStorage.setItem('userEmail', res.user.email);
             history.push("/");
           }
       }).catch(err =>{
          
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
        <div className="signin">
            <div className="signin__container">
            <div className="signin__formContainer">
                <img 
                className="signin__logo" 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" 
                alt="logo">
                </img>
                <form className="signin__form">
                    <input onChange={HandleChange} value={email} type="email" name="email" placeholder="Email"/>
                    <input  onChange={HandleChange} value={password} type="password" name="password" placeholder="Password"/>
                    <button onClick={handleSignin}>Login</button>
                </form>
                <div className="signin__or-section">
                    <span className="line line1"> <hr></hr> </span>
                    <span>OR</span>
                    <span className="line line2">  <hr></hr></span>
                </div>
                
                    <button onClick={handleFacebookSignin} className="signin__facebookLink">Log in with Facebook </button>
               
                   <a href="/forgetpassword" className="signin__forgetPassword">Forget password?</a>
               </div>
            <div className="signin__signupContainer">
                <h5>Don't have an account? <a href="/signup" className="link">Sign up</a></h5>
            </div>
            </div>
        </div>
    )
}

export default Signin
