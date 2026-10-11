import logger from "@/config/logger.js";
import type { Response, Request, NextFunction } from "express";

function errorHandler(error: Error, _: Request, res: Response, next: NextFunction) {
  logger.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = error.message === "Not found" ? 404 : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message.length > 0 ? error.message : "internal server error",
  });
}

export default errorHandler;
