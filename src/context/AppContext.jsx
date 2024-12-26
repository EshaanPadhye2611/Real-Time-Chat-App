import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User document does not exist.");
        return;
      }

      const userData = userSnap.data();

      if (!userData) {
        console.error("User data is undefined.");
        return;
      }

      setUserData(userData);

      if (userData.avatar && userData.name) {
        if (window.location.pathname === "/profile") {
          console.log("User is on the profile page; no redirection to /chat.");
        } else if (window.location.pathname !== "/chat") {
          console.log("Navigating to /chat");
          navigate("/chat");
        }
      } else {
        if (window.location.pathname === "/chat") {
          console.log("User is on the chat page; no redirection to /profile.");
        } else if (window.location.pathname !== "/profile") {
          console.log("Navigating to /profile");
          navigate("/profile");
        }
      }

      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });

      setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    if (!userData) return;

    const chatRef = doc(db, "chats", userData.id);
    const unSub = onSnapshot(chatRef, async (res) => {
      if (res.exists()) {
        const chatItems = res.data().chatsData;
        if (chatItems && chatItems.length > 0) {
          const tempData = [];
          for (const item of chatItems) {
            const userRef = doc(db, "users", item.rId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              tempData.push({ ...item, userData });
            }
          }
          setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
        } else {
          
          setChatData([]);
        }
      }
    });

    return () => {
      unSub();
    };
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
