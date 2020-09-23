import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { Avatar } from '@material-ui/core';
import { auth, storage } from '../../store/firebase';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({open, handleClose}) {
   
   // const userUID = localStorage.getItem('userUID');
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [progress, setProgress] = useState(0);

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

    const handleChangeProfile = (e) =>{
        const selected = e.target.files[0];
         if(selected){
            // setImageFile(selected)
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selected);
            fileReader.onloadend = () => {
                setPhotoUrl(fileReader.result)   
            };
            
            const uploadTask = storage.ref(`/users/${selected.name}`);
            uploadTask.put(selected)
            .on("state_changed",
               (snapshot) => {
                   //progress function...
                   const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
                    }
                }
              
                )}
            )
        }

    }

    const handleSubmit = () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          user.updateEmail(email);
          user.updateProfile({
            displayName: username
          });
          localStorage.setItem('userName', username);
          localStorage.setItem('userEmail', email);
          handleClose();
        } 
      });
       
    }

    useEffect(()=> {
        setEmail(localStorage.getItem('userEmail'));
        setUsername(localStorage.getItem('userName'));
        setPhotoUrl(localStorage.getItem('userPhotoUrl')) 
 }, [])

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Edit Profile"}</DialogTitle>
        <form>
        <DialogContent>
           <div className="input__container">
                <label>
                    <Avatar  style={{ padding: "20px" }} src={ photoUrl} alt={username}/>
                </label>
                    <LinearProgress variant="determinate" value={progress} />
                      <Button
                            variant="contained"
                            component="label"
                            >
                                Upload File
                                <input
                                    accept="image/x-png,image/jpg,image/jpeg" 
                                    type="file"
                                    onChange={handleChangeProfile}
                                    style={{ display: "none" }}
                                />
                       </Button>
               
            </div>
            <div  className="input__container">
                <label>Username</label>
                <input onChange={handleChange} name="username" value={username} type="text"></input>
            </div>
            <div  className="input__container">
                <label>Email</label>
                <input onChange={handleChange} name="email" value={email} type="email"></input>
            </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleSubmit} color="primary">
           Submit
          </Button>
          <Button onClick={handleClose} color="primary">
           Cancel
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
