import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "azeezabioladev@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

function formatEmail(text: string) {
  return `
    <div styles="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
    ">
    <h2>Hello there!</h2>
    <p>${text}</p>
    <p>Testing Area</p>
    </div>
    `;
}

export async function sendVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${to}`;
    await transporter.sendMail({
      subject: "Email Verification",
      from: "azeezabioladev@gmail.com",
      to: to,
      html: formatEmail(`
        Click on the link below to verify your email address. It expire in one hour.<b/>
        <a href="${verificationUrl}">Click Here To Verify</a>
        `),
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}

export async function sendResetPasswordTokenEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${to}`;

    await transporter.sendMail({
      subject: "Password Reset Link",
      from: "azeezabioladev@gmail.com",
      to: to,
      html: formatEmail(`
        You requested for a password reset. Click the link below to reset your password.<b/>
        If you didn't made this request kindly ignore the email.<b/>
        <a href="${verificationUrl}">Click here to reset your password</a>
        `),
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}
