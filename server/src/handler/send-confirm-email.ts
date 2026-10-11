import HttpStatus from "http-status";
import { Request, Response } from "express";
import { isPubSubPayload } from "@/services/pub-sub/gcp.js";
import logger from "@/config/logger.js";
import { MailerService } from "@/services/mailer/types.js";

export const sendConfirmEmailHandler =
  (mailer: MailerService) => async (req: Request, res: Response) => {
    try {
      const { body } = req;

      if (!isPubSubPayload(body)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "invalid pubsub payload!",
        });
      }

      const {
        message: { data: encodedJsonObject },
      } = body;

      const decodedJson = Buffer.from(
        encodedJsonObject as string,
        "base64",
      ).toString("utf-8");

      const parsedPayload = JSON.parse(decodedJson);

      logger.info("sendConfirmEmailHandler:", parsedPayload);
      mailer.sendConfirmationEmail(parsedPayload);

      return res.status(HttpStatus.OK).send();
    } catch (error) {
      logger.error("pub/sub processing failed", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "failed to process pubsub payload",
      });
    }
  };
