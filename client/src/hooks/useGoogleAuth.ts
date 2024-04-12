import { auth, googleProvider } from "@/app/firebaseConfig"
import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useGoogleAuth() {
  const router = useRouter()
  async function googleAuth() {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      router.push('/dashboard')
      toast(`Welcome`)
    } catch (error) {
      toast(`Error: ${error}`)
    }
  }
  return googleAuth
}
