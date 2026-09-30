import winston from "winston";
import env from "./env.js";

const log_level = env.LOG_LEVEL;
const { combine, timestamp, errors, colorize, json, simple } = winston.format;

const logger = winston.createLogger({
  level: log_level,
  format: combine(
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: { service: "blueprint-express" },
  transports: [
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: "logs/exception.log" })],
  rejectionHandlers: [new winston.transports.File({ filename: "logs/rejections.log" })],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(colorize(), simple()),
    }),
  );
}

export default logger;
