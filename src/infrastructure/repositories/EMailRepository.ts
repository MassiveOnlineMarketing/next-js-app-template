import { IEmailService } from "@/domain/repository/IEMailMailRepository";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.WEBSITE_URL;


class EmailRepository implements IEmailService {
  sendVerificationEmail = async (email: string, token: string): Promise<void> => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  
    await resend.emails.send({
      from: "noreply@massiveonlinemarketing.nl",
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  };
  
  sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;
  
    await resend.emails.send({
      from: "noreply@massiveonlinemarketing.nl",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  };
}

const emailRepository = new EmailRepository();

export default emailRepository; 