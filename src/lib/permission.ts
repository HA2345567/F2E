
export const isBypassRoute = [
    "/api/polar/webhook",
    "/api/inngest(.*)",
    "/api/auth(.*)",
    "/convex(.*)",
];
export const isPublicRoutes =[
    "/auth(.*)", "/public(.*)"
]

export const isProtectedRoutes = ['dashboard(.*)'];