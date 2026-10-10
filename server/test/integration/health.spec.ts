import httpStatus from "http-status";
import createServer from "../../src/server";
import { describe, it } from "vitest";
import request from "supertest";

describe("healthz", () => {
  const server = createServer();

  it("should return 200 if it is up", async () => {
    await request(server)
      .get("/v1/healthz")
      .send()
      .expect({ healthz: "OK" })
      .expect(httpStatus.OK);
  });
});
