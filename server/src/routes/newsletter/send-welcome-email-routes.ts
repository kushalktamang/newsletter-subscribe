import sendWelcomeEmail from "@/handler/send-welcome-email.js";
import { MailerService } from "@/services/mailer/types.js";
import { Router } from "express";

export const createConfirmEmailRoutes = (mailer: MailerService) => {
  const confirmRoutes: Router = Router();

  confirmRoutes.post(
    "/newsletter/send-welcome-email",
    sendWelcomeEmail(mailer),
  );

  return confirmRoutes;
};
