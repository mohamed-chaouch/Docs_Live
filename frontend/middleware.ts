import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.ACCESS_TOKEN_SECRET;
const key = new TextEncoder().encode(secretKey);

const validPaths = ["/", "/home", "/doc"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload;
  } catch (error) {
    console.error("Token decryption error:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Bypass middleware for image requests in the public folder
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    return NextResponse.next();
  }

  // Bypass middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    const session = accessToken ? await decrypt(accessToken) : null;

    if (!session) {
      console.error("Session could not be decrypted");
    }

    if (session?.["_id"] && ["/"].includes(pathname)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    const protectedRoutes = ["/home"];

    // Check for protected dynamic paths like /doc/[id]
    if (
      (protectedRoutes.includes(pathname) || pathname.startsWith("/doc/")) &&
      !session?._id
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Handle invalid paths not in validPaths or matching /doc/
    if (!validPaths.includes(pathname) && !pathname.startsWith("/doc/")) {
      return NextResponse.redirect(
        session?._id ? new URL("/home", request.url) : new URL("/", request.url)
      );
    }

    if (protectedRoutes.includes(pathname) && !session?._id) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // if (!validPaths.includes(pathname)) {
    //   return NextResponse.redirect(
    //     session?._id ? new URL("/home", request.url) : new URL("/", request.url)
    //   );
    // }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static).*)", // Catch all paths except static files and favicon
    "/doc/:id*",
  ],
};
