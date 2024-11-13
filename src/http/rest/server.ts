import autoload from "@fastify/autoload";
import { PrismaClient } from "@prisma/client";
import fastify, { FastifyBaseLogger, FastifyInstance } from "fastify";
import path from "path";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface Session {
    user: {
      id: string;
    };
  }
}

export class Server {
  private app: FastifyInstance;
  public log: FastifyBaseLogger;

  constructor() {
    this.app = fastify({
      logger:
        process.env.NODE_ENV !== "production"
          ? {
              transport: {
                target: "pino-pretty",
              },
            }
          : undefined,
    });
    this.log = this.app.log;

    this.app.register(autoload, {
      dir: path.join(__dirname, "plugins"),
    });

    this.app.register(autoload, {
      routeParams: true,
      options: { prefix: "/api/v1" },
      dir: path.join(__dirname, "controllers"),
      matchFilter: (path) => path.endsWith(".controller.ts"),
    });
  }

  async listen() {
    this.app.listen({
      port: 5500,
    });
  }

  async stop() {
    this.app.close();
  }
}
