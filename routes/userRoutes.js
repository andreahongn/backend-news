const router = require("express").Router();
const createUserController = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/userSchema");
const NewsModel = require("../models/newsSchema");
const tokenValidation = require("./tokenValidation");
const jwt = require("jsonwebtoken");

const sendMailer = require("../utils/nodemailer");
const contactMailer = require("../utils/contactmailer");
const responseContactMailer = require("../utils/responsecontactmailer");
const resetPasswordMailer = require("../utils/resetpasswordmailer");
const crypto = require("crypto");

const {
  nameValidation,
  passValidation,
  emailValidation,
  usernameValidation,
  validation,
} = require("../middlewares/validate.js");

const bcrypt = require("bcryptjs");

router
  .post(
    "/register",
    nameValidation(),
    passValidation(),
    emailValidation(),
    usernameValidation(),
    validation,
    async (req, res) => {
      const { body } = req;

      if (!body.name || !body.username || !body.password || !body.email) {
        return res.status(400).json({
          error: true,
          message: "The message has EMPTY fields.",
        });
      }

      const newUserNameExist = await UserModel.findOne({
        username: body.username,
      });
      const newUserMailExist = await UserModel.findOne({
        email: body.email,
      });

      const usernameValidation = () => {
        if (!/^[a-zA-ZÀ-ÿ]{1}$/i.test(body.username.trim().charAt(0))) {
          return "the user name first character must be a letter";
        } else if (
          !/^[a-zA-ZÀ-ÿ\s0-9-_]{2,30}$/i.test(
            body.username.trim().slice(1, body.username.trim().length)
          )
        ) {
          return "the user can only have keyboard scripts as symbols";
        } else if (!/^[\S]{3,30}$/i.test(body.username.trim())) {
          return "the user must not have spaces ";
        } else {
          return null;
        }
      };

      if (usernameValidation()) {
        return res.status(400).json({
          error: true,
          message: usernameValidation(),
        });
      }

      const passwordCharactersValidation =
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,30}$/i.test(
          body.password
        );
      if (passwordCharactersValidation) {
        return res.status(400).json({
          error: true,
          message:
            "the password must have at lest one special character , one digit and one uppercase",
        });
      }

      if (!body.termsandconditions) {
        return res.status(400).json({
          error: true,
          message: "You must accept the terms and conditions",
        });
      }
      if (newUserNameExist || newUserMailExist) {
        return res.status(400).json({
          error: true,
          message: "usuario o email ya existentes",
        });
      }

      // Aplico bcrypt
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(body.password, salt);
      try {
        const newUser = new UserModel({
          name: body.name,
          email: body.email,
          username: body.username,
          role: body.role,
          password: hash,
          termsandconditions: body.termsandconditions,
        });
        await newUser.save();
        await sendMailer(body.name, body.email);

        newUser.password = body.password;
        res.status(200).json({
          error: null,
          message: "You are authorized to access the requested resource.",
          role: newUser.role,
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: true, message: error });
      }
    }
  )

  .post("/login", async (req, res, next) => {
    const { body } = req;

    if (!body.username || !body.password) {
      return res.status(400).json({
        error: true,
        message: "The message has EMPTY fields.",
      });
    }

    const user = await UserModel.findOne({
      username: body.username,
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "The message has WRONG information.",
      });
    }

    const passwordOk = await bcrypt.compare(body.password, user.password);

    if (user && passwordOk) {
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          role: user.role,
          id: user._id,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      user.tokens = token;

      await UserModel.updateOne({ username: body.username }, user);

      return res.status(200).json({
        error: null,
        message: "Credentials are OK",
        token: user.tokens,
        role: user.role,
        username: user.username,
        id: user._id,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Credentials are WRONG",
      });
    }
  })

  .get(
    "/verusuarios",
    tokenValidation(process.env.SUPER_USER),
    async (req, res) => {
      const usuarios = await UserModel.find();

      res.send(
        usuarios.map((element) => ({
          _id: element._id,
          name: element.name,
          username: element.username,
          email: element.email,
          role: element.role,
        }))
      );
    }
  )
  .get(
    "/control",
    tokenValidation([process.env.SUPER_USER, "user"]),
    async (req, res) => {
      res.status(200).json({
        error: null,
        message: "Valid user",
      });
    }
  )

  .put(
    "/edituser/:id",
    tokenValidation(process.env.SUPER_USER),
    nameValidation(),
    emailValidation(),
    usernameValidation(),
    validation,
    async (req, res) => {
      const { name, username, email } = req.body;

      const allUserWithoutOne = await UserModel.find({
        _id: { $ne: req.params.id },
      });
      const usernameValidation = () => {
        if (!/^[a-zA-ZÀ-ÿ]{1}$/i.test(username.trim().charAt(0))) {
          return "the user name first character must be a letter";
        } else if (
          !/^[a-zA-ZÀ-ÿ\s0-9-_]{2,30}$/i.test(
            username.trim().slice(1, username.trim().length)
          )
        ) {
          return "the user can only have keyboard scripts as symbols";
        } else if (!/^[\S]{3,30}$/i.test(username.trim())) {
          return "the user must not have spaces ";
        } else {
          return null;
        }
      };

      if (usernameValidation()) {
        return res.status(400).json({
          error: true,
          message: usernameValidation(),
        });
      }

      if (
        allUserWithoutOne.filter((element) => element.username === username)
          .length > 0 ||
        allUserWithoutOne.filter(
          (element) => element.email.toLowerCase() === email.toLowerCase()
        ).length > 0
      ) {
        return res.status(400).json({
          msg: "usuario o email existentes",
        });
      }
      try {
        const userExist = await UserModel.findOne({ _id: req.params.id });
        const usuarioEditado = await UserModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            name: name,
            username: username,
            email: email,
            role: userExist.role,
            password: userExist.password,
            tokens: userExist.tokens,
            favorites: userExist.favorites,
          },
          { new: true }
        );
        res.status(200).json({ name, username, email });
      } catch (error) {
        console.log(error);
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )

  .get(
    "/logout",
    tokenValidation([process.env.SUPER_USER, "user"]),
    async (req, res) => {
      try {
        await UserModel.updateOne(
          { _id: res.locals.user.id },
          { $set: { tokens: "" } }
        );
        res.json({ mensaje: "Deslogueo ok" });
      } catch (error) {
        res.status(500).json({ msg: error });
      }
    }
  )

  .delete(
    "/deleteuser/:id",
    tokenValidation(process.env.SUPER_USER),
    async (req, res) => {
      try {
        const deletedUser = await UserModel.findOneAndDelete({
          _id: req.params.id,
        });
        res.status(200).json(deletedUser);
      } catch (error) {
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )
  .put("/favoritecreate", tokenValidation("user"), async (req, res) => {
    const { favorites } = req.body;
    try {
      const userExist = await UserModel.findOne({ _id: req.query.id });

      const usuarioEditado = await UserModel.findOneAndUpdate(
        { _id: req.query.id },
        {
          name: userExist.name,
          username: userExist.username,
          email: userExist.email,
          role: userExist.role,
          password: userExist.password,
          tokens: userExist.tokens,
          favorites: favorites,
        },
        { new: true }
      );
      res.status(200).json({ messaje: "user edited correctly" });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })
  .get("/favorite", tokenValidation("user"), async (req, res) => {
    const usuario = await UserModel.find({ _id: req.query.id });
    const currentNews = await NewsModel.find();

    res.send(
      currentNews.reduce((valorAnterior, valorActual) => {
        let filter = usuario[0].favorites.filter(
          (element) => element._id === valorActual._id.toString()
        )[0];

        if (filter) {
          valorAnterior.push(filter);
        }

        return valorAnterior;
      }, [])
    );
  })
  .post(
    "/contact",

    async (req, res) => {
      const { name, email, message } = req.body;

      const errorsContact = [];

      const fieldValues = [
        { name: "name", value: name },
        { name: "email", value: email },
        { name: "message", value: message },
      ];

      const validateField = (value, name) => {
        let error;
        if (value.trim() === "") {
          error = `field  ${name} empty`;
        } else if (value.trim().length < 3) {
          error = `The field ${name} must have at least 3 characters`;
        } else if (name === "name") {
          if (!/^[a-zA-ZÀ-ÿ\s]{3,30}$/.test(value.trim())) {
            error = `The field ${name} can only have letter and spaces`;
          } else {
            error = true;
          }
        } else if (name === "email") {
          if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)) {
            error = `The field ${name} must be an email`;
          } else {
            error = true;
          }
        } else {
          error = true;
        }
        return error;
      };
      fieldValues.forEach((element) => {
        if (validateField(element.value, element.name) !== true) {
          errorsContact.push(validateField(element.value, element.name));
        }
      });
      if (name.trim() === "" && email.trim() === "" && message.trim() === "") {
        return res.status(400).json({
          error: true,
          message: "All the fields are empty",
        });
      }

      if (errorsContact.length > 0) {
        return res.status(400).json({
          error: true,
          message: errorsContact.join("; "),
        });
      }

      try {
        await contactMailer(name, email, message);
        await responseContactMailer(name, email);

        res.status(200).json({ messaje: "mail sended" });
      } catch (error) {
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )
  .put("/resetpassword", async (req, res) => {
    const email = req.body.email;

    const userExist = await UserModel.findOne({ email });

    if (email.trim() === "") {
      return res.status(400).json({
        error: true,
        message: "Debe poner un email",
      });
    }

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      return res.status(400).json({
        error: true,
        message: "No es un email valido",
      });
    }

    if (!userExist) {
      return res.status(400).json({
        error: true,
        message: "No estas registrado",
      });
    }
    try {
      const randomBytes = crypto.randomBytes(8);
      const randomString = randomBytes.toString("hex");

      const newPassword = randomString + "ROLLLING@96";

      const salt = await bcrypt.genSalt();
      const cryptPassword = await bcrypt.hash(newPassword, salt);

      const usuarioEditado = await UserModel.findOneAndUpdate(
        { _id: userExist.id },
        {
          name: userExist.name,
          username: userExist.username,
          email: userExist.email,
          role: userExist.role,
          password: cryptPassword,
          tokens: userExist.tokens,
          favorites: userExist.favorites,
        },
        { new: true }
      );

      await resetPasswordMailer(userExist.name, email, newPassword);
      res.status(200).json({ messaje: "password reseted correctly" });
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  });
module.exports = router;
