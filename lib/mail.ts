import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getSecret } from "./getSecret";
dotenv.config();

const templatePath = path.join(process.cwd(), "mail-template");
const verificationHtml = fs.readFileSync(
  `${templatePath}/verification.html`,
  "utf-8"
);
const resetPasswordHtml = fs.readFileSync(
  `${templatePath}/reset-password.html`,
  "utf-8"
);
const orderNotificationHtml = fs.readFileSync(
  `${templatePath}/order.html`,
  "utf-8"
);

const yandexUserMail = getSecret("YANDEX_USER_MAIL");
const yandexUserMailPass = getSecret("YANDEX_USER_MAIL_PASS");

const transporter = nodemailer.createTransport({
  host: process.env.YANDEX_USER_MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: yandexUserMail,
    pass: yandexUserMailPass,
  },
});

export async function sendUserVerificationToken({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  try {
    const html = verificationHtml.replace("{{ TOKEN }}", token);
    await transporter.sendMail({
      subject: "Верификации аккаунта",
      from: {
        name: "Ellcakes",
        address: process.env.YANDEX_USER_MAIL,
      },
      replyTo: process.env.YANDEX_USER_MAIL,
      to: to,
      html,
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}

export async function sendResetPasswordToken({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  try {
    const html = resetPasswordHtml.replace("{{ TOKEN }}", token);
    await transporter.sendMail({
      subject: "Ваш код подтверждения",
      from: {
        name: "Ellcakes",
        address: process.env.YANDEX_USER_MAIL,
      },
      replyTo: process.env.YANDEX_USER_MAIL,
      to: to,
      html,
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}

export async function sendOrderNotification({
  to,
  orderNumber,
}: {
  to: string;
  orderNumber: string;
}) {
  try {
    const html = orderNotificationHtml.replace(
      "{{ ORDER_NUMBER }}",
      orderNumber
    );
    await transporter.sendMail({
      subject: "Ваш заказ принят",
      from: {
        name: "Ellcakes",
        address: process.env.YANDEX_USER_MAIL,
      },
      replyTo: process.env.YANDEX_USER_MAIL,
      to: to,
      html,
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}
