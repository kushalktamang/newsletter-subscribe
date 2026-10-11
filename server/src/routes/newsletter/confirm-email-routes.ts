import { confirmEmailHandler } from "@/handler/confirm-email-handler.js";
import type PubSubService from "@/services/pub-sub/types.js";
import { Router } from "express";

export const createConfirmEmailRoutes = (pubSub: PubSubService) => {
  const confirmRoutes: Router = Router();

  confirmRoutes.post("/newsletter/confirm-email", confirmEmailHandler(pubSub));

  return confirmRoutes;
};
