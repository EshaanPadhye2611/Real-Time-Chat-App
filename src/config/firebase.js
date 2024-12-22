
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDkx385ueUGwhueZXwNSOb85mv8YW9C4bA",
  authDomain: "chat-app-gs-60412.firebaseapp.com",
  projectId: "chat-app-gs-60412",
  storageBucket: "chat-app-gs-60412.firebasestorage.app",
  messagingSenderId: "241533717085",
  appId: "1:241533717085:web:27e75d9b4e052a37ab1bb4"
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
        chatData:[]
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