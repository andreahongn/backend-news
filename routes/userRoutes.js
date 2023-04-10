const router = require("express").Router();
const createUserController = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/userSchema");
const tokenValidation = require("./tokenValidation");
const jwt = require("jsonwebtoken");
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
      if (newUserNameExist || newUserMailExist) {
        return res.status(400).json({
          error: true,
          message: "User or email already EXISTS",
        });
      }

      const usernameValidation = () => {
        if (!/^[a-zA-ZÀ-ÿ]{1}$/i.test(body.username.trim().charAt(0))) {
          return "the user name first character must be a letter";
        } else if (
          !/^[a-zA-ZÀ-ÿ\s0-9-_]{3,30}$/i.test(
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
        });
        await newUser.save();
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
      // creo token
      const token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          role: user.role,
          id: user._id,
        },
        process.env.TOKEN_SECRET
      );

      user.tokens = token;

      await UserModel.updateOne({ username: body.username }, user);

      console.log("userDespues", user);
      // const userToAddToken = await UserModel.findOneAndUpdate(
      //   { username: body.username },
      //   {
      //     name: user.name,
      //     username: user.username,
      //     password: user.password,
      //     email: user.email,
      //     role: user.role,
      //     tokens: token,
      //   },
      //   {
      //     useFindAndModify: false,
      //   }
      // );

      // res.status(200).json(user);

      return res.status(200).json({
        error: null,
        message: "Credentials are OK",
        token: user.tokens,
        role: user.role,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Credentials are WRONG",
      });
    }
  })

  .get("/verusuarios", async (req, res) => {
    const usuarios = await UserModel.find();
    res.send(usuarios);
  })

  .put("/edituser/:id", tokenValidation, async (req, res) => {
    const { body } = req;
    const token = req.header("auth-token");
    const SUPER_USER = process.env.SUPER_USER || "admin";
    const decodedToken = jwt.decode(token, { complete: true });
    if (
      body.username === SUPER_USER ||
      !decodedToken.payload.role === "admin"
    ) {
      return res.status(400).json({
        error: true,
        message: "Acceso DENEGADO.",
      });
    }
    try {
      const usuarioEditado = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: body.name,
          username: body.username,
          email: body.email,
          role: body.role,
          password: body.password,
        },
        { new: true }
      );
      res.status(200).json(usuarioEditado);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })

  // .post("/logout/:id", tokenValidation, async (req, res) => {
  //   const token = req.header("auth-token");
  //   const decodedToken = jwt.decode(token, { complete: true });
  //   const SUPER_USER = process.env.SUPER_USER || "admin";

  //   if (
  //     body.username === SUPER_USER ||
  //     !decodedToken.payload.role === "admin"
  //   ) {
  //     return res.status(400).json({
  //       error: true,
  //       message: "Acceso DENEGADO.",
  //     });
  //   }
  //   try {
  //     const deletedUser = await UserModel.findOneAndDelete({
  //       _id: req.params.id,
  //     });
  //     res.status(200).json(deletedUser);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(404).json({
  //       error: true,
  //       message: error,
  //     });
  //   }
  // })

  .delete("/deleteuser/:id", tokenValidation, async (req, res) => {
    const token = req.header("auth-token");

    console.log(token);
    const decodedToken = jwt.decode(token, { complete: true });
    const SUPER_USER = process.env.SUPER_USER || "admin";

    if (
      body.username === SUPER_USER ||
      !decodedToken.payload.role === "admin"
    ) {
      return res.status(400).json({
        error: true,
        message: "Acceso DENEGADO.",
      });
    }
    try {
      const deletedUser = await UserModel.findOneAndDelete({
        _id: req.params.id,
      });
      res.status(200).json(deletedUser);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  });
module.exports = router;
