import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyD3JCa5SOdmcjmxQtKw6lzuwWBCx-Dn23Q",
    authDomain: "nestofin-cbf2f.firebaseapp.com",
    databaseURL: "https://nestofin-cbf2f.firebaseio.com",
    projectId: "nestofin-cbf2f",
    storageBucket: "nestofin-cbf2f.appspot.com",
    messagingSenderId: "214148103698",
    appId: "1:214148103698:web:e94494fd988576531522cb",
    measurementId: "G-G0YK19N41G"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
export default firebase