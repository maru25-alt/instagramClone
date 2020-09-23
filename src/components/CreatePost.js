import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';

import Button from '@material-ui/core/Button'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import '../assets/css/imageUpload.css'
import { storage, db , firebase} from '../store/firebase';

import LinearProgress from '@material-ui/core/LinearProgress';



export default function({handleClose, open}) {
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [progress, setProgress] = useState(0);

    const handleChangeCaption = (e) => {
         setCaption(e.target.value)
    }
    const onClose = ()=>{
        handleClose()
    }
    const username = localStorage.getItem('userName');
    const userPhotoUrl  = localStorage.getItem('userPhotoUrl');
    const userUID = localStorage.getItem('userUID')

   const handleShare = (e) => {
        e.preventDefault()
        if(imageFile){
          const uploadTask = storage.ref(`/image/${imageFile.name}`);
          console.log(imageFile)
        uploadTask.put(imageFile)
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
            const  createdAt= firebase.firestore.FieldValue.serverTimestamp();
            storage.ref("images")
            db.collection("posts").add({
                    createdAt,
                    caption: caption,
                    imageUrl: url,
                    username: username,
                    userPhotoUrl,
                    userUID,
                    comments: [],
                    likes: 0
                });
                setProgress(0);
                handleClose();
        })
      }
    }

    const handleChangeImage = (e) => {
        const selected = e.target.files[0];
        if(selected){
            setImageFile(selected)
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selected);
            fileReader.onloadend = () => {
                setImage(fileReader.result)   
            };
        } 
    };

    return (
             <Dialog
                open={open}
                fullScreen
                onClose={onClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                className="createpost"
            >
                <div className="createpost-title">
                    <h1>Create New Post</h1>
                    <IconButton className="close__icon" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                 </div>
                 {username ? 
                <DialogContent>
                    <form className="createpost__form">
                    <LinearProgress className="progress__bar" variant="determinate" value={progress} />
                            <Button
                            variant="contained"
                            component="label"
                            >
                                Upload File
                                <input
                                    accept="image/x-png,image/jpg,image/jpeg" 
                                    type="file"
                                    onChange={handleChangeImage}
                                    style={{ display: "none" }}
                                />
                            </Button>
                               <img className="createpost__imageContainer" src={image} alt="upload_image"></img>
                            <TextareaAutosize onChangeCapture={handleChangeCaption} value={caption} rowsMin={10} className="textarea__caption" aria-label="empty textarea" placeholder="Write a caption..." />
                            <Button onClick={handleShare} class="success share-button ">Share</Button>
                    </form> 
                </DialogContent>
             : <div>
                 <p>sorry you need to loggin first to upload</p>
            </div>}
       </Dialog>
    )
}
