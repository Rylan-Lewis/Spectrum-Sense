import { onAuthStateChanged } from "firebase/auth";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "./app/firebaseConfig";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
   onAuthStateChanged(auth, (user) => {
    if (!user) {      
      console.log(user);
      return NextResponse.redirect(new URL('/', request.url))
    }
    NextResponse.next();  
  });
}


export const config = {
  matcher: '/dashboard',
}
