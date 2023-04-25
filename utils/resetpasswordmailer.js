const nodemailer = require("nodemailer");

const resetPasswordMailer = async (name, email, newPassword) => {
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
    subject: "Nueva contraseña",
    html: `<h1>Hola ${name} </h1>
    <p>Tu nueva contraseña es ${newPassword}</p>
  
    <a target="_blank" href="https://proyecto-final-rolling-code-blog.vercel.app/">https://proyecto-final-rolling-code-blog.vercel.app/</a>`,
  };
  try {
    const transport = nodemailer.createTransport(config);
    await transport.sendMail(message);
  } catch (error) {
    console.log("error NodeMailer", error);
  }
};

module.exports = resetPasswordMailer;
