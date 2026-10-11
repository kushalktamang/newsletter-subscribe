import HttpStatus from "http-status";
import type { Request, Response } from "express";
import type PubSubService from "@/services/pub-sub/types.js";
import { confirmSubscriber } from "@/services/newsletter.js";
import logger from "@/config/logger.js";
import { z } from "zod";

const confirmEmailSchema = z.object({
  email: z.email().trim().toLowerCase(),
  token: z.string().min(1),
});

export const confirmEmailHandler =
  (pubSub: PubSubService) => async (req: Request, res: Response) => {
    try {
      const parsed = confirmEmailSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "valid email and token are required",
        });
      }

      const { email, token } = parsed.data;
      const confirmed = await confirmSubscriber(email, token);
      if (!confirmed) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "invalid or expired confirmation link",
        });
      }

      await pubSub.publish("newsletter-email-confirmed", { email });

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
