import express from "express";
import {
  addNewAssetCategory,
  deleteAllAssetCategory,
  deleteAssetCategoryById,
  getAllAssetCategory,
  getAssetCategoryById,
  updateAssetCategoryById,
} from "../controllers/assetCategory.controller.js";

const router = express.Router();

router.get("/", getAllAssetCategory);
router.get("/:assetCategoryId", getAssetCategoryById);

router.post("/", addNewAssetCategory);

router.put("/:assetCategoryId", updateAssetCategoryById);

router.delete("/:assetCategoryId", deleteAssetCategoryById);
router.delete("/", deleteAllAssetCategory);

export default router;
