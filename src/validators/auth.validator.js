import { body } from "express-validator";

const registerUser = () => {
  return [
    body("username")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Username is mandatory field."),
    body("usernumber")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("usernumber is mandatory field."),
    body("email")
      .notEmpty()
      .trim()
      .isEmail()
      .withMessage("Email is mandatory field."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is mandatory field."),
    // body("firstName")
    //   .notEmpty()
    //   .trim()
    //   .escape()
    //   .withMessage("firstName is mandatory field."),
    // body("lastName")
    //   .notEmpty()
    //   .trim()
    //   .escape()
    //   .withMessage("lastName is mandatory field."),
  ];
};

const loginWithEmailAndPassword = () => {
  return [
    body("email").notEmpty().trim().isEmail(),
    body("password").notEmpty().trim(),
  ];
};
const logout = () => {
  return [body("token").notEmpty().trim()];
};
export default { registerUser, loginWithEmailAndPassword, logout };
