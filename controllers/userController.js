const { validationResult } = require("express-validator");
const UserModel = require("../models/userSchema");

exports.crearUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, lastName, user, password } = req.body;
  const existsUser = await UserModel.findOne({ user: req.body.user });
  console.log("existsUser", existsUser);

  if (existsUser) {
    res.status(400).json({ msg: "usuario duplicado" });
  }
  try {
    const usuario1 = new UserModel(req.body);
    usuario1.save();
    res.send("ok");
  } catch (error) {
    res.status(500).json({ msg: "ERROR", error });
    console.log("registerRoute", error);
  }
};
