// ConmoJS;
// const variable1 = require("./DataBase");

// console.log(variable1);

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
// const routes = require("./routes/userRoutes");
const routes = require("./routes/newsRoutes");

const { body, validationResult } = require("express-validator");
// const router = require("./routes/userRoutes");
const router = require("./routes/newsRoutes");

require("./dataBase");
// middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use("/", routes);

//CRUD
// app.get
// app.post
// app.del

//Routes

// app.use((req, res, next) => {
//   res.status(404).json({ msg: "Pagina no encontrada" });
// });

app.listen(3001, () => {
  console.log("Server encendido en puerto 3001");
});

// app.post(
//   "/register",
//   [
//     body("user", "Campo usuario es requerido").notEmpty(),
//     body("user", "Email invalido").isEmail(),
//     body(
//       "password",
//       "Contraseña: mín 8 caracateres y max 25 caracteres"
//     ).isLength({ min: 8, max: 25 }),
//   ],
//   async (req, res) => {}
// );

app.get("/verusuarios", async (req, res) => {
  // const usuarios = await UserModel.find();
  // res.send(usuarios);
  res.status(200).json({ test: true });
});

// app.get("/verusuario/:id", async (req, res) => {
//   const idParams = req.params.id;
//   const usuario = await UserModel.findOne({ _id: idParams });
//   res.send(usuario);
// });

// app.put("/editarusuario/:id", async (req, res) => {
//   const usuarioEditado = await UserModel.findOneAndUpdate(
//     { _id: req.params.id },
//     { name: req.body.name },
//     { new: true }
//   );
//   res.send(usuarioEditado);
// });

// app.delete("/borrarusuario/:id", async (req, res) => {
//   try {
//     await UserModel.findOneAndDelete({ _id: req.params.id });
//     res.send("usuario Eliminado");
//   } catch (error) {
//     console.log("error", error);
//   }
// });
