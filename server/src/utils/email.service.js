
import nodemailer from "nodemailer";
import "dotenv/config";

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is missing in .env");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset Your Password",
    text: `You requested a password reset.

Open this link to reset your password:
${resetURL}

This link expires after a limited time. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to continue:</p>
        <a href="${resetURL}"
           style="display:inline-block;padding:12px 20px;
           background:#2563eb;color:#ffffff;text-decoration:none;
           border-radius:6px;">
          Reset Password
        </a>
        <p>If the button does not work, use this link:</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });

  console.log("Password reset email sent:", info.messageId);

  return info;
};
