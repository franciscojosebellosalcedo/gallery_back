import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD_MAILER,
  },
});

export const sendEmailUser = async (
  emailTo,
  subjectEmail,
  textEmail,
  htmlEmail
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailTo,
      subject: subjectEmail,
      text: textEmail,
      html: htmlEmail,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
