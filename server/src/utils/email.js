import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `KalpIntel <${process.env.BREVO_USER}>`,
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

  await transporter.sendMail({
    from: `KalpIntel <${process.env.BREVO_USER}>`,
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
