import subscribeHandler from "@/handler/subscribe.js";
import PubSubService from "@/services/pub-sub/types.js";
import express from "express";
import type { Router } from "express";

const createSubscribeRouter = (pubSub: PubSubService): Router => {
  const subscribeRouter = express.Router();

  subscribeRouter.post("/newsletter/subscribe", subscribeHandler(pubSub));

  return subscribeRouter;
};

export default createSubscribeRouter;
