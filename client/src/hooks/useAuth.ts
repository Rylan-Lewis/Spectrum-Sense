import { useEffect } from 'react';
import { auth } from "@/app/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useInfo } from "./useInfo";
import { User } from '@/context/themecontext';
import { setCookie } from 'nookies';

export default function useAuth() {
 const { setUser } = useInfo();

 useEffect(() => {
  async function stateChange(){
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      
      if (user) {

        const token = user.getIdToken().then((result)=>{return result})

        const payload: User = {
          email: user.email || '', // Provide a default value to avoid null
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          uid: user.uid || '',
          accessToken: `${token}` || '',
        };

        setCookie(null,"uid", user.uid,{
          maxAge: 30 * 24 * 60 * 60,
        })
        
        setCookie(null,"token", `${token}` ,{
          maxAge: 30 * 24 * 60 * 60,
        })
        setUser(payload);
      } else {
        setUser({ email: '', displayName: '', photoURL: '' , uid: '', accessToken: ''});
      }
    });
  }
  stateChange();
 }, [setUser]); 
}
