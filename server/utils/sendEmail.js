const nodeMailer = require("nodemailer");

exports.sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Ignore unauthorized certificates
    },
  });
  const options = {
    from: `"KrishiSahyog" <${process.env.MAIL_USER}>`,
    to: email,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(options);
};