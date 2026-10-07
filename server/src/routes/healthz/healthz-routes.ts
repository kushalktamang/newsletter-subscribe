import express from "express";
import type { Router } from "express";
import httpStatus from "http-status";

const checkHealth = (): Router => {
  const healthz = express.Router();

  healthz.get("/healthz", (_, res) => {
    const healthStatus = res.status(httpStatus.OK).json({ healthz: "OK" });
    return healthStatus;
  });

  return healthz;
};

export default checkHealth;
