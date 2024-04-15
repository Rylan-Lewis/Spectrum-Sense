import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const token = cookies().get("token")
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard',
};