const nodemailer = require("nodemailer");

const sendMailer = async (name, email) => {
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
    subject: "Bienvenid@ a la Rollingneta",
    html: `<h1>Hola ${name} !! Te subiste a la Rollingneta con éxito</h1>
    <h2>Ahora podés acceder a las últimas novedades del mundo deportivo</h2>
    <img src="https://www.mundoprimaria.com/wp-content/uploads/2020/07/deporte.jpg" alt="sports">
    <h5>Por favor no responder este mail</h5>`,
  };
  try {
    const transport = nodemailer.createTransport(config);
    await transport.sendMail(message);
  } catch (error) {
    console.log("error NodeMailer", error);
  }
};

module.exports = sendMailer;
