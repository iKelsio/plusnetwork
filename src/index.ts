import { Server } from "@http/rest/server";
// import { bootstrap } from "@infra/shared/bootstrap";
import * as emoji from "node-emoji";

async function start() {
  // await bootstrap();
  const server = new Server();

  await server.listen();

  process
    .on("SIGINT", () => {
      server.stop();
      server.log.info(`${emoji.get("zap")} Server gracefully shut down!`);
    })
    .on("unhandledRejection", (error) => {
      server.log.error(
        `${emoji.get("skull")} uncaughtException captured: ${error}`
      );
    })
    .on("uncaughtException", (error) => {
      server.log.error(
        `${emoji.get("skull")} uncaughtException captured: ${error}`
      );
    });
}

start();
