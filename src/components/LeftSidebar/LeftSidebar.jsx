import React, { useContext, useState } from 'react'
import "./LeftSidebar.css"
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
const LeftSidebar = () => {

  const navigate = useNavigate();
  const {userData} = useContext(AppContext);
  const [user,setUser] = useState(null);
  const [showsearch,setShowSearch] = useState(false);
const inputHandler = async (e) => {
  try {
    const input  = e.target.value;
    if(input){
      setShowSearch(true);
      const userRef = collection(db,'users');
      const q = query(userRef,where("username","==",input.toLowerCase()));
      const querySnap = await getDocs(q);
      if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
        setUser(querySnap.docs[0].data());
      }
      else{
        setUser(null);
      }
    }
    else{
      setShowSearch(false);
    }
    
  } catch (error) {
    
  }
}

const addChat = async () =>{
  const messagesRef = collection(db,"messages");
  const chatsRef = collection(db,"chats");
  try {
    const newMessageRef  = doc(messagesRef);
    await setDoc(newMessageRef,{
      createdAt:serverTimestamp(),
      messages:[]
    })

    await updateDoc(doc(chatsRef,user.id),{
      chatsData:arrayUnion({
        messageId:newMessageRef.id,
        lastMessage:"",
        rId:userDate.id,
        updatedAt:Date.now(),
        messageSeen:true
      })
    })

    await updateDoc(doc(chatsRef,userData.id),{
      chatsData:arrayUnion({
        messageId:newMessageRef.id,
        lastMessage:"",
        rId:user.id,
        updatedAt:Date.now(),
        messageSeen:true
      })
    })

  } catch (error) {
    toast.error(error.message);
    console.error(error);
    
  }

}

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo}className='logo' alt="" />
            <div className="menu">
                <img src={assets.menu_icon} alt="" />
                <div className="sub-menu">
                <button
                onClick={() => {
                  console.log('Navigating to /profile');
                  navigate('/profile');
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '5px 0',
                  width: '100%',
                }}
              >
                Edit Profile
              </button>
                  <hr />
                  <p>Logout</p>
                </div>
            </div>
        </div>
        <div className="ls-search">
            <img src={assets.search_icon} alt="" />
            <input onChange={inputHandler} type='text' placeholder='Search here ..'/>
        </div>
      </div>
      <div className="ls-list">
       {showsearch  && user

       ? <div onClick={addChat} className="friends add-user">
         <img src={user.avatar} alt="" />
         <p>{user.name}</p>
       </div>
       :
       Array(12).fill("").map((item,index)=>(
        <div key ={index} className="friends">
        <img src={assets.eshaan} alt="" />
        <div>
            <p>Eshaan Padhye</p>
            <span>Hello, How are you ?</span>
        </div>
    </div>
    ))
       }


      
      </div>
    </div>
  )
}

export default LeftSidebar
