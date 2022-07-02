import nodemailer from "nodemailer";

export const sendLoginEmail = async ({
  email,
  url,
  token,
}: {
  email: string;
  url: string;
  token: string;
}) => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mail = await transporter.sendMail({
    from: '"Hane doe" <j.doe@example.com>',
    to: email,
    subject: "Login to your Account",
    html: `login by clicking this here <a href="${url}/login#token=${token}">login</a>?`,
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(mail)}`);
};
