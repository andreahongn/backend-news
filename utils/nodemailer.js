const nodemailer = require("nodemailer");

const sendMailer = async (name, email) => {
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
    to: email,
    subject: "Bienvenid@ a la Rollingneta",
    html: `<h1>Hola ${name} !! Te subiste a la Rollingneta con éxito. Ahora podés acceder a las últimas novedades del mundo deportivo</h1>
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
