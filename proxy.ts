import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: ["/((?!api/auth|api/stream-webhook|login|_next|favicon.ico).*)"],
}
