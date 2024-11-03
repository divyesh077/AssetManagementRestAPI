import express from "express";
import {
  addAssets,
  addNewAsset,
  assignAssetToUser,
  deleteAllAssets,
  getAllAssets,
  getAssetById,
  getAssetByUser,
} from "../controllers/asset.controller.js";
import { admin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", getAllAssets);
router.get("/:assetId", getAssetById);
router.get("/user/:userId", getAssetByUser);

router.post("/", admin, addNewAsset);
router.post("/many", addAssets);

router.put("/:assetId", admin, assignAssetToUser);

router.delete("/:assetId", admin, getAllAssets);
router.delete("/", admin, deleteAllAssets);

export default router;
