import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { destroyCookie } from "nookies";
import { toast } from "sonner";
import { useInfo } from "./useInfo";
import { auth } from "@/app/firebaseConfig";
import { useRouter } from "next/router";

export default function useLogOutEffect() {
  const { setUser } = useInfo();
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        await signOut(auth);
        setUser({ email: '', displayName: '', photoURL: '', uid: '', accessToken: '' });
        destroyCookie(null, "token");
        destroyCookie(null, "verified");
        destroyCookie(null, "uid");
        toast.success("You have been logged out successfully!");
        router.push('/');
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Some error occurred while logging out!");
      }
    }

    logout(); // Call the logout function when the component mounts
  }, [setUser, router]);

  // Since this hook doesn't return anything, it's common to return null or undefined
  return null;
}
