import checkHealth from "./routes/healthz.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import logger from "./config/logger.js";
import httpStatus from "http-status";
import morganMiddleware from "./middleware/morgan.js";
import notFound from "./middleware/not-found.js";

const createServer = (): Express => {
  const server = express();

  server.use(helmet());
  server.use(cors());
  server.use(cookieParser());
  server.use(morganMiddleware);
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("/", (_, res) => {
    logger.info("express blueprint");
    res.status(httpStatus.OK).send("blueprint for express with typescript");
  });

  // @GET /api/v1/healthz
  server.use("/api/v1/", checkHealth());

  // error handling for 404  route not found
  server.use(notFound);

  return server;
};

export default createServer;
