import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  const token = cookies().get("token")
  const verified = cookies().get("verified") 
  
  if (url == "/dashboard" && verified?.value == 'false') {
    return NextResponse.redirect(new URL('/register/more-details', request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/register/more-details'] 
};