
import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
import { isBypassRoute, isProtectedRoutes, isPublicRoutes } from "./lib/permission";

const ProtectedMathcher = createRouteMatcher(isProtectedRoutes);
const PublicRouteMathcher = createRouteMatcher(isPublicRoutes);
const BypassMatcher = createRouteMatcher(isBypassRoute);
export default convexAuthNextjsMiddleware(async (request , {convexAuth}) =>{
    if (BypassMatcher(request)) {
        return;
    }
    const authed = await convexAuth.isAuthenticated();
    // Only redirect unauthenticated users from protected routes

    if(ProtectedMathcher(request) && authed){
        return nextjsMiddlewareRedirect(request, `/dashboard`);
    }
    if (ProtectedMathcher(request) && !authed) {
        return nextjsMiddlewareRedirect(request, `/auth/sign-in`);
    }
    // Public routes do not redirect
    return;
},{
    cookieConfig:{maxAge : 60*60*24*30},
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.


  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

