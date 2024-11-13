import fp from "fastify-plugin";
import fastifySession from "@fastify/session";

import fastifyCookie from "@fastify/cookie";

export default fp(async (app, opts) => {
  app.register(fastifyCookie);

  app.register(fastifySession, {
    secret: "4aadc153-23f9-4548-8395-6aa52a302118",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  });
});
