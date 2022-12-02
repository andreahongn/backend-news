const router = require("express").Router();
const createUserController = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/userSchema");

const bcrypt = require("bcryptjs");

router
  .post("/register", async (req, res) => {
    console.log("POST /users/register");
    const { body } = req;
    // Chequeo si el body no llega vacío para directamente devolver
    if (!body.name || !body.username || !body.password || !body.email) {
      return res.status(400).json({
        error: true,
        message: "The message has EMPTY fields.",
      });
    }

    // Chequeo doble de previa existencia del usuario, en la API y en el Schema con unique
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

    // Aplico bcrypt
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(body.password, salt);
    try {
      const newUser = new UserModel({
        name: body.name,
        email: body.email,
        username: body.username,
        password: hash,
      });
      await newUser.save();
      newUser.password = body.password;
      res.status(200).json(newUser);
      console.log("ADD user " + newUser.name);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: true, message: error });
    }
  })

  .post("/login", async (req, res, next) => {
    const { body } = req;
    // timeStamp("POST on /users/login");

    // TODO: Add validations
    if (!body.username || !body.password) {
      return res.status(400).json({
        error: true,
        message: "The message has EMPTY fields.",
      });
    }

    const user = await UserModel.findOne({
      username: body.username,
    });
    console.log("BBDD connection.");
    console.log(user);

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "The message has WRONG information.",
      });
    }

    const passwordOk = await bcrypt.compare(body.password, user.password);

    if (user && passwordOk) {
      return res.status(200).json({
        error: null,
        message: "Credentials are OK",
      });
      // const token = jwt.sign(
      //   {
      //     name: user.name,
      //     role: user.role,
      //     id: user._id,
      //   },
      //   process.env.TOKEN_SECRET
      // );

      // const userToAddToken = await UserModel.findOneAndUpdate(
      //   { name: body.name },
      //   {
      //     name: user.name,
      //     username: user.username,
      //     password: user.password,
      //     email: user.email,
      //     tokens: token,
      //   },
      //   {
      //     useFindAndModify: false,
      //   }
      // );

      // return res.header("auth-token", token).status(200).json({
      //   error: null,
      //   message: "Credentials are OK",
      //   role: user.role,
      //   data: { token },
      // });
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

  .put("/edituser/:id", async (req, res) => {
    const { body } = req;
    try {
      const usuarioEditado = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: body.name,
          username: body.username,
          email: body.email,
          password: body.password,
        },
        { new: true }
      );
      res.status(200).json(usuarioEditado);
      res.send(usuarioEditado);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })

  .delete("/deleteuser/:id", async (req, res) => {
    try {
      await UserModel.findOneAndDelete({ _id: req.params.id });

      res.send("Usuario eliminado");
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  });
module.exports = router;
