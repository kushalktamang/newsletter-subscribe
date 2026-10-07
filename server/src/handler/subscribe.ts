import logger from "@/config/logger.js";
import { isEmailValid } from "@/utils/email.js";
import type { Request, Response } from "express";
import httpStatus from "http-status";

interface SubscribePayload {
  email?: string;
}

const subscribe = async (req: Request, res: Response) => {
  try {
    // 1. get the email from the req;
    const { email = "" } = req.body as SubscribePayload;

    // 2. Validate the email
    if (email === null) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email is required!",
      });
    }

    if (!isEmailValid(email)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email is not valid",
      });
    }

    return res.status(httpStatus.OK).json({ message: "OK" });
  } catch (error) {
    logger.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "failed to upsert subscriber",
    });
  }
};

export default subscribe;
