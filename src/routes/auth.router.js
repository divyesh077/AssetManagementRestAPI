import express from "express";
import {
  register,
  login,
  logout,
  refreshAuthTokens,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

import authValidator from "../validators/auth.validator.js";
import { validateResult } from "../utils/validationResult.js";

const router = express.Router();

router.post(
  "/register",
  authValidator.registerUser(),
  validateResult,
  register
);

router.post("/login", login);

router.post("/logout", auth, logout);

router.post("/refresh-tokens", auth, refreshAuthTokens);

export default router;
