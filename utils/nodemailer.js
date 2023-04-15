const nodemailer = require("nodemailer");

const sendMailer = async () => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "andreahongn@gmail.com",
      pass: "bhzdvsshjixxrrlv",
    },
  };

  const message = {
    from: "andreahongn@gmail.com",
    to: "andreahongn@gmail.com",
    subject: "Registro exitoso",
    text: "Bienvenido a la rollingneta",
  };
  try {
    const transport = nodemailer.createTransport(config);
    await transport.sendMail(message);
  } catch (error) {
    console.log("error NodeMailer", error);
  }
};

module.exports = sendMailer;
