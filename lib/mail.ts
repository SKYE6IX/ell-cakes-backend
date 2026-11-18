import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { getSecret } from "./getSecret";
dotenv.config();

export type SellerNewOrderNotification = {
  ordernumber: string;
  orderitems: {
    productname: string;
    productfilling: string;
    quantity: number;
    unitprice: number;
    subtotal: number;
  }[];
  totalamount: number;
  deliveryaddress?: string;
  deliveryoption: string;
  deliverydate: string;
  paymentmethod: string;
  orderurl: string;
};

const templatePath = path.join(process.cwd(), "mail-template");

const verificationHtml = fs.readFileSync(`${templatePath}/verification.html`, "utf-8");
const resetPasswordHtml = fs.readFileSync(`${templatePath}/reset-password.html`, "utf-8");
const orderNotificationHtml = fs.readFileSync(`${templatePath}/order.html`, "utf-8");
const sellerNotificationHtml = fs.readFileSync(`${templatePath}/seller.html`, "utf-8");
const requestCallHtml = fs.readFileSync(`${templatePath}/request-call.html`, "utf-8");
const requestCustomCakeHtml = fs.readFileSync(`${templatePath}/custom-cake-req.html`, "utf-8");

const yandexUserMail = getSecret("YANDEX_USER_MAIL");
const yandexUserMailPass = getSecret("YANDEX_USER_MAIL_PASS");

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: yandexUserMail,
    pass: yandexUserMailPass,
  },
});

export async function verifyNodeMailTransport() {
  try {
    const isVerified = await transporter.verify();
    return isVerified;
  } catch (error) {
    console.log("Error occur in verification => ", error);
    return false;
  }
}

export async function sendUserVerificationToken({ to, token }: { to: string; token: string }) {
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
    return true;
  } catch (error) {
    console.error("An error occur while trying to send email=> ", error);
    return false;
  }
}

export async function sendResetPasswordToken({ to, token }: { to: string; token: string }) {
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
    const html = orderNotificationHtml.replace("{{ ORDER_NUMBER }}", orderNumber);
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

export async function sendNewOrderNotificationToSeller({
  data,
}: {
  data: SellerNewOrderNotification;
}) {
  try {
    const sellerTemplate = Handlebars.compile(sellerNotificationHtml);
    const html = sellerTemplate(data);

    await transporter.sendMail({
      subject: "Новый заказ получен",
      from: {
        name: "Ellcakes",
        address: process.env.YANDEX_USER_MAIL,
      },
      replyTo: process.env.YANDEX_USER_MAIL,
      to: process.env.SELLER_EMAIL,
      html,
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}

export interface RequestCallFields {
  email: string;
  company: string;
  message: string;
  phoneNumber: string;
}

export async function sendRequestCall({
  requestCallInput,
}: {
  requestCallInput: RequestCallFields;
}) {
  try {
    const html = requestCallHtml
      .replace("{{ EMAIL }}", requestCallInput.email)
      .replace("{{ COMPANY }}", requestCallInput.company)
      .replace("{{ MESSAGE }}", requestCallInput.message)
      .replace("{{ PHONE_NUMBER }}", requestCallInput.phoneNumber);

    await transporter.sendMail({
      subject: "Новый запрос на звонок",
      from: {
        name: "Ellcakes",
        address: process.env.YANDEX_USER_MAIL,
      },
      to: process.env.SUPPORT_EMAIL,
      html,
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}

interface RequestForCustomCakeInput {
  shape: string;
  filling: string;
  stackLevel: string;
  guestNum: string;
  colorPallete: string;
  allergies: string;
  textDescription: string;
  decorations: string;
  refPhoto: string | null;
  eventDate: string;
  occassion: string;
  name: string;
  phoneNumber: string;
  address: string;
}

export async function sendCustomCakeRequest({
  requestInput,
}: {
  requestInput: RequestForCustomCakeInput;
}) {
  try {
    const template = Handlebars.compile(requestCustomCakeHtml);
    const data = {
      ...requestInput,
      stacklevel: requestInput.stackLevel,
      guestnum: requestInput.guestNum,
      colorpallete: requestInput.colorPallete,
      textdescription: requestInput.textDescription,
      refphoto: requestInput.refPhoto,
      eventdate: requestInput.eventDate,
      phonenumber: requestInput.phoneNumber,
    };

    const html = template(data);

    await transporter.sendMail({
      subject: "Новый запрос на индивидуальный торт",
      from: {
        name: "Ellcakes",
        address: process.env.YANDEX_USER_MAIL,
      },
      to: process.env.SELLER_EMAIL,
      html,
    });
  } catch (error) {
    console.error("An error occur while trying to send email", error);
  }
}
