const nodemailer = require("nodemailer");

const contactMailer = async (name, email, messageUser) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.MAIL_NODEMAILER,
      pass: process.env.PASSWORD_APP,
    },
  };

  const message = {
    from: process.env.MAIL_NODEMAILER,
    to: process.env.MAIL_NODEMAILER,
    subject: `Mensaje desde La Rollingneta de ${name} cuyo mail es ${email} `,
    text: messageUser,
  };
  try {
    const transport = nodemailer.createTransport(config);
    await transport.sendMail(message);
  } catch (error) {
    console.log("error NodeMailer", error);
  }
};

module.exports = contactMailer;
