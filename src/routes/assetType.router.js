import express from "express";
import {
  addNewAssetType,
  deleteAllAssetTypes,
  deleteAssetTypeById,
  getAllAssetTypes,
  getAssetTypesByCategoryId,
  getAssetTypesByCategory,
  getAssetTypeById,
  updateAssetTypeById,
} from "../controllers/assetType.controlle.js";

const router = express.Router();

router.get("/", getAllAssetTypes);
router.get("/by-categoryId/:categoryId", getAssetTypesByCategoryId);
router.get("/by-category", getAssetTypesByCategory);
router.get("/:assetTypeId", getAssetTypeById);

router.post("/", addNewAssetType);

router.put("/:assetTypeId", updateAssetTypeById);

router.delete("/:assetTypeId", deleteAssetTypeById);
router.delete("/", deleteAllAssetTypes);

export default router;
