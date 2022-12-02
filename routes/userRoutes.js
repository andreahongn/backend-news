const router = require("express").Router();
const createUserController = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/userSchema");

router
  .post("/register", async (req, res) => {
    console.log("POST /users/register");
    const { body } = req;
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
  });

module.exports = router;
