import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const defaultLoginUrl = "/login";

const authRoutes = [defaultLoginUrl];
const publicRoutes = ["/"];

export async function proxy(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	const isAuthRoute = authRoutes.includes(pathName);
	const isPublicRoute = publicRoutes.includes(pathName);
	// This is the recommended approach to optimistically redirect users
	// also do the auth check in each page this is just an optimistic redirect NOT secure.
	const sessionCookie = getSessionCookie(request);

	if (!sessionCookie) {
		if (isAuthRoute) {
			return NextResponse.next();
		}
		if (isPublicRoute) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL(defaultLoginUrl, request.url));
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
