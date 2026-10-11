import env from "./config/env.js";
import logger from "./config/logger.js";
import createServer from "./server.js";
import { ResendService } from "./services/mailer/mailer.js";
import { GooglePubSubService } from "./services/pub-sub/gcp.js";
import { TestPubSub } from "./services/pub-sub/test-pubsub.js";
import PubSubService from "./services/pub-sub/types.js";

const PORT = Math.trunc(Number(env.PORT));
const pubSub: PubSubService =
  env.NODE_ENV === "development"
    ? new TestPubSub()
    : new GooglePubSubService(env.GCP_PROJECT_ID);

const mailer = new ResendService({
  apiKey: env.RESEND_API_KEY,
  sender: env.RESEND_SENDER,
});

const server = createServer({ pubSub, mailer }).listen(PORT, (error) => {
  if (error !== undefined) {
    logger.error("Failed to start the server", error);
    return;
  }
  logger.info(`SERVER READY AT: http://localhost:${PORT}`);
});

const shutdown = (exitCode: number): number => {
  process.exit(exitCode);
};

const closeServer = (exitCode: number): void => {
  server.close(() => {
    void shutdown(exitCode);
  });
};

// handle unhandled promise rejection (e.g database connection error)
process.on("unhandledRejection", (error) => {
  console.error("unhandled rejection", error);
  closeServer(1);
});

// handles uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("uncaught exception", error);
  closeServer(1);
});

// graceful shutdown
process.on("SIGTERM", () => {
  console.error("SIGTERM received, shutting down gracefully");
  closeServer(1);
});
