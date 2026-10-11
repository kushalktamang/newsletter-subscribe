import { sendConfirmEmailHandler } from "@/handler/send-confirm-email.js";
import { MailerService } from "@/services/mailer/types.js";
import { Router } from "express";

export const createSendConfirmRoutes = (mailer: MailerService) => {
  const sendConfirmRoutes: Router = Router();

  sendConfirmRoutes.post(
    "/newsletter/send-confirm-email",
    sendConfirmEmailHandler(mailer),
  );

  return sendConfirmRoutes;
};
