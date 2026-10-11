import HttpStatus from "http-status";
import type { Request, Response } from "express";
import { isPubSubPayload } from "@/services/pub-sub/gcp.js";
import logger from "@/config/logger.js";
import type { MailerService } from "@/services/mailer/types.js";
import { z } from "zod";

const confirmationPayloadSchema = z.object({
  email: z.email(),
  token: z.string().min(1),
});

export const sendConfirmEmailHandler =
  (mailer: MailerService) => async (req: Request, res: Response) => {
    try {
      const body: unknown = req.body;

      if (!isPubSubPayload(body)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "invalid pubsub payload!",
        });
      }

      let decodedPayload: unknown = null;
      try {
        const decodedJson = Buffer.from(body.message.data, "base64").toString("utf8");
        decodedPayload = JSON.parse(decodedJson);
      } catch {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "invalid confirmation email data",
        });
      }

      const parsedPayload = confirmationPayloadSchema.safeParse(decodedPayload);
      if (!parsedPayload.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "invalid confirmation email data",
        });
      }

      await mailer.sendConfirmationEmail(parsedPayload.data);
      logger.info("Confirmation email sent", {
        email: parsedPayload.data.email,
      });

      return res.status(HttpStatus.OK).send();
    } catch (error) {
      logger.error("pub/sub processing failed", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "failed to process pubsub payload",
      });
    }
  };
