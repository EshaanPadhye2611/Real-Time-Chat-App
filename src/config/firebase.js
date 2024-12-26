
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyC9s8Uk_4xGN135Y_1GGjYZeWQ_Wcv3kqA",
    authDomain: "chat-app-gs-80d9f.firebaseapp.com",
    projectId: "chat-app-gs-80d9f",
    storageBucket: "college-compass-5e968.appspot.com",
    messagingSenderId: "725361423137",
  appId: "1:725361423137:web:e9c1a3f8466176832b8460"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) =>{
   try {
    const res= await createUserWithEmailAndPassword(auth,email,password);
    const user  = res.user;
    await setDoc(doc(db,"users",user.uid),{
        id:user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hello",
        lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
        chatsData:[]
    })
   } catch (error) {
     console.error(error)
     toast.error(error.code.split('/')[1].split('-').join(""));

   }
}

const login = async (email,password) =>{
try {
    await signInWithEmailAndPassword(auth,email,password);
} catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(""));
}
}

const logout  = async ()=>{
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(""));
        
    }
    
}

export {signup,login,logout,auth,db}