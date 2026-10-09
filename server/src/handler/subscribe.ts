import logger from "@/config/logger.js";
import { upsertSubscriber } from "@/services/newsletter.js";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
});

export type SubscribePayload = z.infer<typeof subscribeSchema>;

const subscribe = async (req: Request, res: Response) => {
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
      // publish to Pub/Sub with subscriber.email and subscriber.token
    }

    logger.info("Subscribe handler: request processed");

    res.status(httpStatus.OK).json({
      success: true,
      message:
        "If this email can be subscribed, a confirmation link is on its way.",
    });
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to subscribe",
    });
  }
};

export default subscribe;
