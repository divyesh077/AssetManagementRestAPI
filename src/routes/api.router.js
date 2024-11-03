import express from "express";
import authRouter from "./auth.router.js";
import usersRouter from "./users.router.js";
import assetsRouter from "./assets.router.js";
import tokenRouter from "./token.router.js";
import assetTypeRouter from "./assetType.router.js";
import assetCategoryRouter from "./assetCategory.router.js";

import { auth } from "../middlewares/auth.middleware.js";
import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/tokens", tokenRouter);
router.use("/users", usersRouter);

router.use("/assets", assetsRouter);
router.use("/asset-category", auth, admin, assetCategoryRouter);
router.use("/asset-types", auth, admin, assetTypeRouter);

// router.use("/asset-category", assetCategoryRouter);
// router.use("/asset-types", assetTypeRouter);
export default router;
