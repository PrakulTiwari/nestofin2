import firebase from 'firebase'

const firebaseConfig = {
    apiKey:       process.env.REACT_APP_FAPIKEY,
    authDomain:          process.env.REACT_APP_AUTHDOMAIN,
    databaseURL:          process.env.REACT_APP_DATABASEURL,
    projectId:      process.env.REACT_APP_PROJECTID,
    storageBucket:          process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId:              process.env.REACT_APP_MESSAGINGSENDERID,
    appId:  process.env.REACT_APP_APPID
};
firebase.initializeApp(firebaseConfig);
export default firebase