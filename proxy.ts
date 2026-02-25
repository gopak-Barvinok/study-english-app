export { auth as proxy } from "@/auth";

export const config = {
  matcher: [ "/((?!api/auth|api/stream-webhook|app/login|_next|favicon.ico|$).*)", ],
};