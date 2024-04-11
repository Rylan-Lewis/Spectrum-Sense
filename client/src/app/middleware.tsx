import { onAuthStateChanged } from "firebase/auth";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "./firebaseConfig";

export async function middleware(request: NextRequest) {
  // Checking whether user is authenticated
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      return NextResponse.redirect("/login");
    }
    NextResponse.next();
  });
}
