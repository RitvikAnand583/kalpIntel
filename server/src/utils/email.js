const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendEmail = async ({ to, subject, html }) => {
  console.log(`[EMAIL] Sending email to: ${to}`);
  console.log(`[EMAIL] BREVO_API_KEY: ${process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.substring(0, 8) + "****" : "NOT SET"}`);
  console.log(`[EMAIL] BREVO_SENDER: ${process.env.BREVO_SENDER || "NOT SET"}`);

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "KalpIntel", email: process.env.BREVO_SENDER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[EMAIL] Brevo API error (${response.status}):`, error);
    throw new Error(`Brevo API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log(`[EMAIL] Email sent successfully! MessageId: ${data.messageId}`);
  return data;
};

export const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await sendEmail({
    to,
    subject: "Verify Your Email",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a1a;">Email Verification</h2>
        <p style="color: #4a4a4a; line-height: 1.6;">
          Click the button below to verify your email address. This link will expire in 24 hours.
        </p>
        <a href="${verificationUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 16px;">
          Verify Email
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you did not create an account, please ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendResetEmail = async (to, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await sendEmail({
    to,
    subject: "Reset Your Password",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a1a;">Password Reset</h2>
        <p style="color: #4a4a4a; line-height: 1.6;">
          Click the button below to reset your password. This link will expire in 15 minutes.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 16px;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you did not request a password reset, please ignore this email.
        </p>
      </div>
    `,
  });
};
