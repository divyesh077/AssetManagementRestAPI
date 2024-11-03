import mongoose, { Schema } from "mongoose";

// Define the AssetType schema
const assetCategorySchema = new Schema(
  {
    category: {
      type: String,
      uniqe: true,
      required: true,
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

assetCategorySchema.statics.isCategoryExist = async function (category) {
  return !!(await this.findOne({ category }));
};
// Create a model from the schema and export it
export const AssetCategory = mongoose.model(
  "AssetCategory",
  assetCategorySchema
);
