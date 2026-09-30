import logger from "@/config/logger.js";
import type { Request, Response } from "express";
import morgan from "morgan";
import { z } from "zod";

const requestLogSchema = z.object({
  method: z.string().optional(),
  url: z.string().optional(),
  status: z.number(),
  content_length: z.string().optional(),
  response_time: z.number(),
});

const morganMiddleware = morgan(
  (tokens, req: Request, res: Response) => {
    return JSON.stringify({
      method: tokens.method?.(req, res),
      url: tokens.url?.(req, res),
      status: Number(tokens.status?.(req, res) ?? ""),
      content_length: tokens.res?.(req, res, "content-length"),
      response_time: Number(tokens["response-time"]?.(req, res) ?? ""),
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message: string) => {
        const data = requestLogSchema.parse(JSON.parse(message));
        logger.info(`incoming-request`, data);
      },
    },
  },
);

export default morganMiddleware;
