import checkHealth from "./routes/healthz/healthz-routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import logger from "./config/logger.js";
import httpStatus from "http-status";
import morganMiddleware from "./middleware/morgan.js";
import notFound from "./middleware/not-found.js";
import createSubscribeRouter from "./routes/newsletter/subscribe-routes.js";
import errorHandler from "./handler/error/error-handler.js";
import type PubSubService from "./services/pub-sub/types.js";
import { MailerService } from "./services/mailer/types.js";
import { createSendConfirmRoutes } from "./routes/newsletter/send-confirm-email-routes.js";
import { createWelcomeEmailRoutes } from "./routes/newsletter/send-welcome-email-routes.js";
import { createConfirmEmailRoutes } from "./routes/newsletter/confirm-email-routes.js";

interface CreateServerParams {
  pubSub: PubSubService;
  mailer: MailerService;
}

const createServer = ({ pubSub, mailer }: CreateServerParams): Express => {
  const server = express();

  server.use(helmet());
  server.use(cors());
  server.use(cookieParser());
  server.use(morganMiddleware);
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("/", (_, res) => {
    logger.info("express blueprint");
    res.status(httpStatus.OK).send("newsletter subscribe");
  });

  // @GET /api/v1/healthz
  server.use("/v1", checkHealth());
  // @GET /api/v1/newsletter/subscribe
  server.use("/v1", createSubscribeRouter(pubSub));
  server.use("/v1", createConfirmEmailRoutes(pubSub));
  server.use("/v1", createSendConfirmRoutes(mailer));
  server.use("/v1", createWelcomeEmailRoutes(mailer));

  // error handling for 404  route not found
  server.use(notFound);
  server.use(errorHandler);

  return server;
};

export default createServer;
