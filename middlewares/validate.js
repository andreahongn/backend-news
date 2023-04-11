const { body, validationResult } = require("express-validator");

const nameValidation = () => {
  return [body("name").exists().isLength({ min: 3, max: 31 }).isAlpha().trim()];
};

const usernameValidation = () => {
  return [body("username").exists().isLength({ min: 3, max: 31 }).trim()];
};
const passValidation = () => {
  return [body("password").exists().isLength({ min: 8, max: 31 })];
};

const emailValidation = () => {
  return [body("email").exists().isEmail().isLength({ min: 8, max: 31 })];
};

const validation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

module.exports = {
  nameValidation,
  passValidation,
  usernameValidation,
  emailValidation,
  validation,
};
