import { body, param } from "express-validator";

const createNewUser = () => {
  return [
    body("username")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Username is mandatory field."),
    body("email")
      .notEmpty()
      .trim()
      .isEmail()
      .withMessage("Email is mandatory field."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is mandatory field."),
  ];
};

const getUserByUserNumber = () => {
  return [
    body("usernumber").notEmpty().withMessage("usernumber is mandatory field."),
  ];
};

const updateUserPassword = () => {
  return [
    param("userId").notEmpty().withMessage("Please provide the userId!!!"),
    body("newPassword")
      .notEmpty()
      .trim()
      .withMessage("Please provide the new password!!!"),
  ];
};

const updateUserRole = () => {
  return [
    param("userId").notEmpty().withMessage("Please provide the userId!!!"),
    body("role")
      .notEmpty()
      .trim()
      .withMessage("Please provide the new role!!!"),
  ];
};

const updateUserAvtar = () => {
  return [
    param("userId").notEmpty(),
    body("avtar")
      .notEmpty()
      .trim()
      .withMessage("Please provide the new Avtar!!!"),
  ];
};

export default {
  createNewUser,
  getUserByUserNumber,
  updateUserPassword,
  updateUserRole,
  updateUserAvtar,
};
