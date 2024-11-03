import express from "express";
import {
  // createNewUser,
  deleteAllUser,
  deleteUserById,
  getAssetsByUserId,
  getUserById,
  getUserByUserNumber,
  getUsers,
  updateUserAvtar,
  updateUserById,
  updateUserPassword,
  updateUserRole,
} from "../controllers/user.controller.js";
import userValidator from "../validators/user.validator.js";
import { validateResult } from "../utils/validationResult.js";

const router = express.Router();

router.get("/", getUsers);
router.get(
  "/by-user-number",
  userValidator.getUserByUserNumber(),
  validateResult,
  getUserByUserNumber
);
router.get("/:userId/assets", getAssetsByUserId);

router.get("/:userId", getUserById);

router.put("/:userId", updateUserById);
router.put(
  "/:userId/password",
  userValidator.updateUserPassword(),
  validateResult,
  updateUserPassword
);
router.put(
  "/:userId/role",
  userValidator.updateUserRole(),
  validateResult,
  updateUserRole
);
router.put(
  "/:userId/avtar",
  userValidator.updateUserAvtar(),
  validateResult,
  updateUserAvtar
);

router.delete("/:userId", deleteUserById);
router.delete("/", deleteAllUser);
export default router;
