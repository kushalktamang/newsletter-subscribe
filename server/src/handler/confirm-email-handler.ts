import HttpStatus from "http-status";
import type { Request, Response } from "express";
import { MailerService } from "@/services/mailer/types.js";
import PubSubService from "@/services/pub-sub/types.js";
import { confirmSubscriber } from "@/services/newsletter.js";
import logger from "@/config/logger.js";

interface ConfirmEmailPayload {
  email?: string;
  token?: string;
}

export const confirmEmailHandler =
  (pubSub: PubSubService, mailer: MailerService) =>
  async (req: Request, res: Response) => {
    try {
      const { email, token } = req.body as ConfirmEmailPayload;

      if (!email || !token) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "email and token are required",
        });
      }

      const confirmed = await confirmSubscriber(email, token);
      if (!confirmed) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "invalid or expired confirmation link",
        });
      }

      await pubSub.publish("newsletter-email-confirmed", { email });
      try {
        await mailer.sendWelcomeEmail({ email });
      } catch (error) {
        logger.error("welcome email failed", error);
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "email confirmed",
      });
    } catch (error) {
      logger.error("confirm email failed", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "failed to confirm email",
      });
    }
  };
