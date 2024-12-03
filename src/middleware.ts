import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextRequest } from "next/server";

// public pages
const isPublic = createRouteMatcher(["/auth", "/api/uploadthing"]);
export default convexAuthNextjsMiddleware(
  (request: NextRequest, { convexAuth }) => {
    if (!isPublic(request) && !convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, "/auth");
    }
    if (isPublic(request) && convexAuth.isAuthenticated() && !request.nextUrl.pathname.startsWith('/api/uploadthing')) {
      return nextjsMiddlewareRedirect(request, "/courses");
    }
  },
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};