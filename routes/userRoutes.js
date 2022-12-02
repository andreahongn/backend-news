const router = require("express").Router();
const createUserController = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/userSchema");
// Chequeo si el body no llega vacío para directamente devolver
// if (!body.name || !body.password || !body.email) {
//   return res.status(400).json({
//     error: true,
//     message: "The message has EMPTY fields.",
//   });
// }

// Chequeo doble de previa existencia del usuario, en la API y en el Schema con unique
// const newUserNameExist = await User.findOne({
//   name: body.name,
// });
// const newUserMailExist = await User.findOne({
//   email: body.email,
// });
// if (newUserNameExist || newUserMailExist) {
//   return res.status(400).json({
//     error: true,
//     message: "User or email already EXISTS",
//   });
// }

// Aplico bcrypt
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(body.password, salt);
router
  .post("/register", async (req, res) => {
    console.log("POST /users/register");
    const { body } = req;

    try {
      const newUser = new UserModel({
        name: body.name,
        email: body.email,
        username: body.username,
        password: body.password,
      });
      await newUser.save();
      //   newUser.password = body.password;
      res.status(200).json(newUser);
      console.log("ADD user " + newUser.name);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: true, message: error });
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
