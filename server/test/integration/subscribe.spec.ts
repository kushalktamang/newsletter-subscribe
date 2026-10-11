import httpStatus from "http-status";
import createServer from "../../src/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { upsertSubscriber } from "../../src/services/newsletter.js";
import { TestPubSub } from "../../src/services/pub-sub/test-pubsub";
import TestMailer from "../../src/services/mailer/test-mailer";

import { z } from "zod";

const errorBodySchema = z.object({ message: z.string() });

vi.mock("../../src/services/newsletter.js", () => ({
  upsertSubscriber: vi
    .fn()
    .mockResolvedValue({ email: "valid@mail.com", token: "test-token" }),
  confirmSubscriber: vi.fn(),
}));

describe("subscribe", () => {
  const pubSub = new TestPubSub();
  const mailer = new TestMailer();

  const server = createServer({ pubSub, mailer });

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
    const publish = vi.spyOn(pubSub, "publish").mockResolvedValue("published");

    await request(server)
      .post("/v1/newsletter/subscribe")
      .send({ email: "valid@mail.com" })
      .expect("Content-Type", /json/u)
      .expect(httpStatus.OK);

    expect(upsertSubscriber).toHaveBeenCalledWith("valid@mail.com");
    expect(publish).toHaveBeenCalledWith("newsletter-subscribe", {
      email: "valid@mail.com",
      token: "test-token",
    });
  });

  it("should not publish when the subscriber is already active", async () => {
    vi.mocked(upsertSubscriber).mockResolvedValueOnce(null);
    const publish = vi.spyOn(pubSub, "publish");

    await request(server)
      .post("/v1/newsletter/subscribe")
      .send({ email: "valid@mail.com" })
      .expect(httpStatus.OK);

    expect(publish).not.toHaveBeenCalled();
  });

  it("should return 500 if publishing the confirmation job fails", async () => {
    vi.spyOn(pubSub, "publish").mockRejectedValueOnce(
      new Error("Pub/Sub unavailable"),
    );

    await request(server)
      .post("/v1/newsletter/subscribe")
      .send({ email: "valid@mail.com" })
      .expect(httpStatus.INTERNAL_SERVER_ERROR);
  });
});
