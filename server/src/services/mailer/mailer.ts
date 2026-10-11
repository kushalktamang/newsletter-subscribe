import env from "@/config/env.js";
import type { MailerService, SendConfirmEmailPayload, SendWelcomeEmailPayload } from "./types.js";
import { Resend } from "resend";
import logger from "@/config/logger.js";

interface ResendServiceConfig {
  sender: string;
  apiKey: string;
}

const appUrl = env.APP_URL;

export class ResendService implements MailerService {
  private readonly resend: Resend;
  private readonly sender: string;

  constructor({ sender, apiKey }: ResendServiceConfig) {
    this.resend = new Resend(apiKey);
    this.sender = sender;
  }

  async sendConfirmationEmail({ email, token }: SendConfirmEmailPayload) {
    if (email.length === 0 || token.length === 0) {
      throw new Error("email and token are required");
    }

    const link = `${appUrl}/confirm-email?token=${encodeURIComponent(
      token,
    )}&email=${encodeURIComponent(email)}`;

    const { error } = await this.resend.emails.send({
      from: this.sender,
      to: email,
      subject: "confirmation email",
      html: `
             <p>Please confirm your email:</p>
             <a href="${link}">${link}</a>
           `,
    });

    if (error !== null) {
      logger.error("Resend failed to send confirmation email", error);
      throw new Error(`Resend failed to send confirmation email: ${error.message}`);
    }

    logger.info("Resend accepted confirmation email", { email });
  }

  async sendWelcomeEmail({ email }: SendWelcomeEmailPayload): Promise<void> {
    if (email.length === 0) {
      throw new Error("email is required");
    }

    const { error } = await this.resend.emails.send({
      from: this.sender,
      to: email,
      subject: "welcome email",
      html: `<p>welcome to our newsletter</p>`,
    });

    if (error !== null) {
      logger.error("Resend failed to send welcome email", error);
      throw new Error(`Resend failed to send welcome email: ${error.message}`);
    }
  }
}
