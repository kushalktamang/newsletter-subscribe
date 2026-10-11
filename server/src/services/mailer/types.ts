interface SendConfirmEmailPayload {
  email: string;

  token: string;
}

interface SendWelcomeEmailPayload {
  email: string;
}

interface MailerService {
  sendConfirmationEmail(payload: SendConfirmEmailPayload): Promise<void>;

  sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void>;
}

export { SendConfirmEmailPayload, SendWelcomeEmailPayload, MailerService };
