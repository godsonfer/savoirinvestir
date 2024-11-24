import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextRequest } from "next/server";

// public pages
const isPublic = createRouteMatcher(["/auth"]);
export default convexAuthNextjsMiddleware(
  (request: NextRequest, { convexAuth }) => {
    if (!isPublic(request) && !convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, "/auth");
    }
    if (isPublic(request) && convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, "/");
    }
  },
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
