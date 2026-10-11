import { confirmEmailHandler } from "@/handler/confirm-email-handler.js";
import { MailerService } from "@/services/mailer/types.js";
import PubSubService from "@/services/pub-sub/types.js";
import { Router } from "express";

export const createConfirmEmailRoutes = (
  pubSub: PubSubService,
  mailer: MailerService,
) => {
  const confirmRoutes: Router = Router();

  confirmRoutes.post(
    "/newsletter/confirm-email",
    confirmEmailHandler(pubSub, mailer),
  );

  return confirmRoutes;
};
