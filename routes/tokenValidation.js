const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema");

const tokenValidation = (role) => async (req, res, next) => {
  // Recupero el token del header

  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    if (verify.exp < Date.now() / 1000) {
      return res.status(401).json({ msg: "Expire Token" });
    }

    const userLogin = await UserModel.findOne({
      _id: verify.id,
      tokens: token,
    });

    if (userLogin.role !== role && !Array.isArray(role)) {
      res.status(401).json({ msg: "No estas autorizado" });
    } else if (Array.isArray(role) && !role.includes(verify.role)) {
      res.status(401).json({ msg: "No estas autorizado" });
    } else {
      (res.locals.user = userLogin), (res.locals.token = token);
      next();
    }
  } catch (error) {
    res.status(500).json({ msg: "Fallo Server", error });
  }
};
module.exports = tokenValidation;
