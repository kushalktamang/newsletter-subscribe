import httpStatus from "http-status";
import createServer from "../../src/server";
import { TestPubSub } from "../../src/services/pub-sub/test-pubsub";
import TestMailer from "../../src/services/mailer/test-mailer";

import { describe, it } from "vitest";
import request from "supertest";

describe("healthz", () => {
  const pubSub = new TestPubSub();
  const mailer = new TestMailer();
  const server = createServer({ pubSub, mailer });

  it("should return 200 if it is up", async () => {
    await request(server).get("/v1/healthz").send().expect({ healthz: "OK" }).expect(httpStatus.OK);
  });
});
