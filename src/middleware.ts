import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authedRoutes = ["/"];
const notAuthedRoutes = ["/login", "/login/verification"];

export async function middleware(request: NextRequest) {
	const userId = request.cookies.get("userId")?.value;
	const verification = request.cookies.get("verification")?.value;

	const path = request.nextUrl.pathname;
	const isAuthedRoute = authedRoutes.includes(path);
	const isNotAuthedRoute = notAuthedRoutes.includes(path);

	const isUserAuthed = userId && !verification;

	// Если мы хотим попасть на маршруты, требующие входа, то возвращаем пользователя на вход, если он не вошел
	if (isAuthedRoute && !isUserAuthed) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	// Если пользователь не ввел почту для подтверждения входа, то возвращем его на вход
	if (isUserAuthed && path.startsWith("/login/verification")) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	// Если пользователь уже вошел и хочет попасть на верификацию, то возвращаем его на главную
	if (isNotAuthedRoute && isUserAuthed) {
		return NextResponse.redirect(new URL("/", request.nextUrl));
	}

	// Если нет условий для редиректа, пропускаем запрос дальше
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
