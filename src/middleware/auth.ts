import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  // Only protect /admin/ routes
  if (url.pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization");

    const expectedPassword = import.meta.env.ADMIN_PASSWORD;

    if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Bearer realm="Access to admin area"',
        },
      });
    }
  }

  return next();
});
