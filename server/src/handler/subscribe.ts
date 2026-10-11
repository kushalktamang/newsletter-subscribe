import logger from "@/config/logger.js";
import { upsertSubscriber } from "@/services/newsletter.js";
import PubSubService from "@/services/pub-sub/types.js";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
});

// type SubscribePayload = z.infer<typeof subscribeSchema>;

const subscribeHandler = (pubSub: PubSubService) => async (req: Request, res: Response) => {
  // 1. validate and normalize the email
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Email is not valid",
    });
    return;
  }

  try {
    // 2. create or re-issue the pending subscription
    const subscriber = await upsertSubscriber(parsed.data.email);

    // 3. publish the confirmation email job (only when a token was issued)
    if (subscriber !== null) {
      await pubSub.publish("newsletter-subscribe", {
        email: subscriber.email,
        token: subscriber.token,
      });
    }

    logger.info("Subscribe handler: request processed");

    res.status(httpStatus.ACCEPTED).json({
      success: true,
      message: "If this email can be subscribed, a confirmation email is on its way.",
    });
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to subscribe",
    });
  }
};

export default subscribeHandler;
