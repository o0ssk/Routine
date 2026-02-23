import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/goals/:path*",
        "/routines/:path*",
        "/tasks/:path*",
        "/achievements/:path*",
        "/settings/:path*",
    ],
};
