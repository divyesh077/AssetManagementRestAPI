import express from "express";
import {
  deleteTokensByUser,
  deleteAllTokens,
} from "../controllers/token.controller.js";

const router = express.Router();

router.delete("/:userId", deleteTokensByUser);
router.delete("/", deleteAllTokens);
export default router;
