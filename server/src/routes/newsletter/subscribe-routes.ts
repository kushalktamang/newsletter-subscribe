import subscribe from "@/handler/subscribe.js";
import express from "express";
import type { Router } from "express";

const createSubscribeRouter = (): Router => {
  const subscribeRouter = express.Router();

  subscribeRouter.post("/newsletter/subscribe", subscribe);

  return subscribeRouter;
};

export default createSubscribeRouter;
