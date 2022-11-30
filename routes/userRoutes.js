// const express = require("express");

// const router = express();
// const createUserController = require("../controllers/userController");
// const { body } = require("express-validator");

// router
//   .post(
//     "/register",
//     [
//       body("user", "Campo usuario es requerido").notEmpty(),
//       body("user", "Email invalido").isEmail(),
//       body(
//         "password",
//         "Contraseña: mín 8 caracateres y max 25 caracteres"
//       ).isLength({ min: 8, max: 25 }),
//     ],
//     createUserController.crearUsuario
//   )

//   .get("/verusuarios", async (req, res) => {
//     const usuarios = await UserModel.find();
//     res.send(usuarios);
//   });

// module.exports = router;
