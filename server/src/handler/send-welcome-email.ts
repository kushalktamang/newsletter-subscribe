import logger from "@/config/logger.js";
import type { MailerService } from "@/services/mailer/types.js";
import { isPubSubPayload } from "@/services/pub-sub/gcp.js";
import type { Request, Response } from "express";
import HttpStatus from "http-status";
import { z } from "zod";

const welcomeEmailPayloadSchema = z.object({
  email: z.email(),
});

const sendWelcomeEmail = (mailer: MailerService) => async (req: Request, res: Response) => {
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
        message: "invalid welcome email data",
      });
    }

    const parsedPayload = welcomeEmailPayloadSchema.safeParse(decodedPayload);
    if (!parsedPayload.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "invalid welcome email data",
      });
    }

    await mailer.sendWelcomeEmail(parsedPayload.data);
    logger.info("Welcome email sent", { email: parsedPayload.data.email });

    return res.status(HttpStatus.OK).send();
  } catch (error) {
    logger.error("pub/sub processing failed", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to process pubsub payload",
    });
  }
};

export default sendWelcomeEmail;
