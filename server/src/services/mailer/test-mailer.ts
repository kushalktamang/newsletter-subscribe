import logger from "@/config/logger.js";
import { MailerService, SendConfirmEmailPayload, SendWelcomeEmailPayload } from "./types.js";

export default class TestMailer implements MailerService {
  async sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void> {
    logger.info("sending welcome email..");
    logger.info(payload);
    logger.info("fake welcome has been sent");
  }

  async sendConfirmationEmail(payload: SendConfirmEmailPayload): Promise<void> {
    logger.info("sending fake email..");
    logger.info(payload);
    logger.info("fake email has been sent");
  }
}
