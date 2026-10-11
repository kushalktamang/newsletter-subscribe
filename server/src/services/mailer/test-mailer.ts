import {
  MailerService,
  SendConfirmEmailPayload,
  SendWelcomeEmailPayload,
} from "./types.js";

export default class TestMailer implements MailerService {
  async sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void> {
    console.log("sending welcome email..");
    console.log(payload);
    console.log("fake welcome has been sent");
  }

  async sendConfirmationEmail(payload: SendConfirmEmailPayload): Promise<void> {
    console.log("sending fake email..");
    console.log(payload);
    console.log("fake email has been sent");
  }
}
