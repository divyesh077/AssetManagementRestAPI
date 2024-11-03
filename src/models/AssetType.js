import mongoose, { Schema } from "mongoose";
import { AssetCategory } from "./AssetCategory.js";

// Define the AssetType schema
const assetTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
      index: true,
      validate: {
        validator: async function (v) {
          const assetCategory = await AssetCategory.findById(v);
          console.log(assetCategory);
          return !!assetCategory;
        },
      },
      message: "Catergory validation failed!!!",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model from the schema and export it
export const AssetType = mongoose.model("AssetType", assetTypeSchema);
