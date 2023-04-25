const nodemailer = require("nodemailer");

const responseContactMailer = async (name, email) => {
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
    to: email,
    subject: "Mensaje recibido",
    html: `<h1>Hola ${name} !! Hemos recibido su mensaje</h1>
    <h2>En breve estará recibiendo una respuesta</h2>
    <img src="https://www.mundoprimaria.com/wp-content/uploads/2020/07/deporte.jpg" alt="sports">
    <h2>Atentamente La Rollingneta</h2>`,
  };
  try {
    const transport = nodemailer.createTransport(config);
    await transport.sendMail(message);
  } catch (error) {
    console.log("error NodeMailer", error);
  }
};

module.exports = responseContactMailer;
