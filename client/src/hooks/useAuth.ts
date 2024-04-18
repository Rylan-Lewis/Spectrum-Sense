import { useEffect } from 'react';
import { auth } from "@/app/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useInfo } from "./useInfo";
import { User } from '@/context/themecontext';
import { destroyCookie, setCookie } from 'nookies';
import path from 'path';

export default function useAuth() {
  const { setUser } = useInfo();
  useEffect(() => {
    async function stateChange() {
      onAuthStateChanged(auth, async (user) => {
        console.log(user);
        if (user) {
          try {
            const token = await user.getIdToken();
            const payload: User = {
              email: user.email || '', // Provide a default value to avoid null
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              uid: user.uid || '',
              accessToken: `${token}` || '',
            };

            setCookie(null, "uid", user.uid, {
              maxAge: 30 * 24 * 60 * 60,
              path: '/'
            })

            setCookie(null, "token", `${token}`, {
              maxAge: 30 * 24 * 60 * 60,
              path: '/'
            })
            setCookie(null, "verified", `${user.emailVerified}`, {
              maxAge: 30 * 24 * 60 * 60,
              path: '/',
            })
            setUser(payload);
          } catch (error) {
            console.error("Error getting token:", error);
            setUser({ email: '', displayName: '', photoURL: '', uid: '', accessToken: '' });
            destroyCookie(null, "uid",)
            destroyCookie(null, "verified")
            destroyCookie(null, "token")
          }
        } else {
          setUser({ email: '', displayName: '', photoURL: '', uid: '', accessToken: '' });
          destroyCookie(null, "uid")
          destroyCookie(null, "verified")
          destroyCookie(null, "token")
        }
      });
    }
    stateChange();
  }, [setUser]);
}
