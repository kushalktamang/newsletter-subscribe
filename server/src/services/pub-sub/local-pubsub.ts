import type { MailerService } from "@/services/mailer/types.js";
import type PubSubService from "./types.js";
import { z } from "zod";

const confirmationPayloadSchema = z.object({
  email: z.email(),
  token: z.string().min(1),
});

const welcomeEmailPayloadSchema = z.object({
  email: z.email(),
});

class LocalPubSubService implements PubSubService {
  private readonly mailer: MailerService;

  constructor(mailer: MailerService) {
    this.mailer = mailer;
  }

  validatePayload(payload: Record<string, unknown>): boolean {
    return confirmationPayloadSchema.safeParse(payload).success;
  }

  async publish(topicId: string, payload: Record<string, unknown>): Promise<string> {
    if (topicId === "newsletter-subscribe") {
      const parsed = confirmationPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error("Invalid confirmation email payload");
      }

      await this.mailer.sendConfirmationEmail(parsed.data);
      return "local-confirmation-email-sent";
    }

    if (topicId === "newsletter-email-confirmed") {
      const parsed = welcomeEmailPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error("Invalid welcome email payload");
      }

      await this.mailer.sendWelcomeEmail(parsed.data);
      return "local-welcome-email-sent";
    }

    throw new Error(`Unsupported local Pub/Sub topic: ${topicId}`);
  }
}

export { LocalPubSubService };
