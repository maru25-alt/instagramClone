import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC0zo_MS9czX_FwhV-2nGrhFW99QSZvsTQ",
    authDomain: "instagram-clone-7f273.firebaseapp.com",
    databaseURL: "https://instagram-clone-7f273.firebaseio.com",
    projectId: "instagram-clone-7f273",
    storageBucket: "instagram-clone-7f273.appspot.com",
    messagingSenderId: "100220712494",
    appId: "1:100220712494:web:769702f32937afe74091bf"
  });


  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();
  const auth = firebaseApp.auth();

  export {db, storage, auth , firebase}