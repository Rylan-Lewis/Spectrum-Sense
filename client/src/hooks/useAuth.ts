import { useEffect } from 'react';
import { auth } from "@/app/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useInfo } from "./useInfo";
import { User } from '@/context/themecontext';

export default function useAuth() {
 const { setUser } = useInfo();

 useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const payload: User = {
          email: user.email || '', // Provide a default value to avoid null
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        };
        setUser(payload);
      } else {
        setUser({ email: '', displayName: '', photoURL: '' });
      }
    });

    // Cleanup function
    return () => unsubscribe();
 }, [setUser]); // Dependency array ensures this effect runs only once
}
