import httpStatus from "http-status";
import createServer from "../../src/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { upsertSubscriber } from "../../src/services/newsletter.js";
import { z } from "zod";

const errorBodySchema = z.object({ message: z.string() });

vi.mock("../../src/services/newsletter.js", () => ({
  upsertSubscriber: vi
    .fn()
    .mockResolvedValue({ email: "valid@mail.com", token: "test-token" }),
  confirmSubscriber: vi.fn(),
}));

describe("subscribe", () => {
  const server = createServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if not sent an email in the body", async () => {
    const response = await request(server)
      .post("/v1/newsletter/subscribe")
      .send({})
      .expect(httpStatus.BAD_REQUEST);

    const body = errorBodySchema.parse(response.body);
    expect(body.message).toBe("Email is not valid");
    expect(upsertSubscriber).not.toHaveBeenCalled();
  });

  it("should return 200 if valid email is sent", async () => {
    await request(server)
      .post("/v1/newsletter/subscribe")
      .send({ email: "valid@mail.com" })
      .expect("Content-Type", /json/u)
      .expect(httpStatus.OK);

    expect(upsertSubscriber).toHaveBeenCalledWith("valid@mail.com");
  });
});
