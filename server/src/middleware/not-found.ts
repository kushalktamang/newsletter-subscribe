import type { Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (_req: Request, res: Response) => {
  res
    .status(httpStatus.NOT_FOUND)
    .json({ message: "Endpint not found, Check the API Documentation" });
};

export default notFound;
