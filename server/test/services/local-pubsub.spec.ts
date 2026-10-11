import type { MailerService } from "../../src/services/mailer/types.js";
import { LocalPubSubService } from "../../src/services/pub-sub/local-pubsub.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("LocalPubSubService", () => {
  const sendConfirmationEmail = vi.fn(() => Promise.resolve());
  const sendWelcomeEmail = vi.fn(() => Promise.resolve());
  const mailer: MailerService = {
    sendConfirmationEmail,
    sendWelcomeEmail,
  };
  const pubSub = new LocalPubSubService(mailer);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends confirmation emails directly through the mailer", async () => {
    const payload = { email: "valid@mail.com", token: "test-token" };

    await expect(pubSub.publish("newsletter-subscribe", payload)).resolves.toBe(
      "local-confirmation-email-sent",
    );
    expect(sendConfirmationEmail).toHaveBeenCalledWith(payload);
  });

  it("sends a welcome email when a subscriber confirms locally", async () => {
    const email = "valid@mail.com";

    await expect(pubSub.publish("newsletter-email-confirmed", { email })).resolves.toBe(
      "local-welcome-email-sent",
    );
    expect(sendWelcomeEmail).toHaveBeenCalledWith({ email });
  });

  it("rejects unsupported topics and invalid email payloads", async () => {
    await expect(
      pubSub.publish("unknown-topic", {
        email: "valid@mail.com",
        token: "test-token",
      }),
    ).rejects.toThrow("Unsupported local Pub/Sub topic");

    await expect(
      pubSub.publish("newsletter-subscribe", { email: "invalid", token: "" }),
    ).rejects.toThrow("Invalid confirmation email payload");
    expect(sendConfirmationEmail).not.toHaveBeenCalled();
  });
});
