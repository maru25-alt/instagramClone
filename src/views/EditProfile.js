import React, { useEffect, useState } from 'react'
import { Avatar, Button, LinearProgress, CircularProgress } from '@material-ui/core';
import { auth, storage } from '../store/firebase';
import '../assets/css/editProfile.css'

function EditProfile() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [imageData, setimageData] = useState(null)
    const [progress, setProgress] = useState(0);
    const [showProgress, setshowProgress] = useState(false)
    const [showButton, setshowButton] = useState(false)
    const [disable, setDisable] = useState(false)

    const handleChange = (e) => {
        if(e.target.name === "username"){
            setUsername(e.target.value)
        }
        else if(e.target.name === "email"){
           setEmail(e.target.value)
        }
        else{
            return 0
        }
    }

  const handleCancel  = (e) => {
      e.preventDefault()
    setEmail(localStorage.getItem('userEmail'));
    setUsername(localStorage.getItem('userName'));
  }

    const handleChangeProfile = (e) =>{
        const selected = e.target.files[0];
         if(selected){
            setimageData(selected)
            setshowButton(true)
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selected);
            fileReader.onloadend = () => {
                setPhotoUrl(fileReader.result)   
            };
        }
    }

    const submitProfile = () => {
        setshowProgress(true);
        setDisable(true);
        const uploadTask = storage.ref(`/users/${imageData.name}`);
            uploadTask.put(imageData)
            .on("state_changed",
               (snapshot) => {
                   const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                   console.log(progress)
                   setProgress(progress);
           },
            (error) => {
               console.log(error)
           },async () => {
                const url = await uploadTask.getDownloadURL();
                setProgress(0);
                auth.onAuthStateChanged((user) => {
                    if(user){
                        user.updateProfile({
                            photoUrl: url
                        });
                        localStorage.setItem('userPhotoUrl', url)
                        setshowProgress(false);
                        setimageData(null);
                        setshowButton(false);
                        setDisable(false);
                    }}
                )}
            )}

    const handleSubmit = (e) => {
    e.preventDefault()
    auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          user.updateEmail(email);
          user.updateProfile({
            displayName: username
          });
          localStorage.setItem('userName', username);
          localStorage.setItem('userEmail', email);
        } 
      });   
    }

    useEffect(()=> {
        setEmail(localStorage.getItem('userEmail'));
        setUsername(localStorage.getItem('userName'));
        setPhotoUrl(localStorage.getItem('userPhotoUrl')) 
 }, [])

    return (
        <form className="editProfile">
                <div className="input__container mb-5">
                  <label >
                    <Avatar  style={{ width: "70px", height: "70px" }} src={ photoUrl} alt={username}/>
                  </label>
                  {showProgress &&   <LinearProgress variant="determinate" value={progress} />}
                  {showButton  ?
                  <div  className="progressWrapper">
                      <Button 
                       className="buttonClassProgress"  
                       component="label"  
                       variant="contained"  
                       color="primary" 
                       onClick={ submitProfile }>
                           Upload
                        </Button>
                      {disable && <CircularProgress size={24} className="buttonProgress" />}
                  </div>
                    :
                      <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            >
                                Change Profile
                                <input
                                    accept="image/x-png,image/jpg,image/jpeg" 
                                    type="file"
                                    onChange={handleChangeProfile}
                                    style={{ display: "none" }}
                                />
                       </Button>  }
               </div>
                <div  className="input__container">
                    <label>Username</label>
                    <input onChange={handleChange} name="username" value={username} type="text"></input>
                </div>
                <div  className="input__container">
                    <label>Email</label>
                    <input onChange={handleChange} name="email" value={email} type="email"></input>
                </div>
                <div className="buttons__container">
                    <div className="action__buttons">
                        <button className="button" onClick={handleSubmit} >
                           Save Changes
                        </button>
                        <button onClick={handleCancel} className="button" >
                             Cancel
                         </button>
                    </div>
                    
                </div>
            
        </form>
    )
}

export default EditProfile
