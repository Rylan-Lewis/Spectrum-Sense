"use client";
import { useInfo } from "@/hooks/useInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebaseConfig";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export default function AvatarNav() {
  const { user, setUser } = useInfo();
  const date = new Date();
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "long" }); // Get month name
  let year = date.getFullYear();
  const router = useRouter();


  async function handleClick() {
    try {
      const response = await signOut(auth);
      setUser({ email: '', displayName: '', photoURL: '' , uid: '', accessToken: ''});
      destroyCookie(null, "token");
      destroyCookie(null, "verified");
      destroyCookie(null, "uid");
      toast("You have been logged out successfully!");
      router.push('/')
    } catch (error) {
      toast("Some error occurred!")
    }   
  }

  return (
    <div className="flex">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex justify-center items-center gap-2">
              <Avatar>
                <AvatarImage src={''}></AvatarImage>
                <AvatarFallback>
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs">{user.email}</p>
                <p className="text-xs font-light">{`${month}, ${year}.`}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={"/dashboard"}>
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleClick}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}