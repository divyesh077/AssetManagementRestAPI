import mongoose from "mongoose";

import { User } from "./User.js";
import { AssetCategory } from "./AssetCategory.js";
import { AssetType } from "./AssetType.js";

const { Schema } = mongoose;

// Define the Asset schema
const assetSchema = new Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
      validate: {
        validator: async function (v) {
          return !!(await AssetCategory.findById(v));
        },
        message: "Catergory validation failed!!!",
      },
    },
    assetType: {
      type: Schema.Types.ObjectId,
      ref: "AssetType",
      validate: {
        validator: async function (v) {
          if (!v) {
            return true;
          }
          const assetType = await AssetType.findOne({
            _id: v,
            categoryId: this.category,
          });
          return !!assetType;
        },
        message: "AssetType validation failed!!!",
      },
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      enum: ["Baroda Office", "Abingdon Office", "other"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "disposed"],
      default: "active",
    },
    acquisitionDate: {
      type: Date,
      required: true,
    },
    purchaseCost: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    depreciationRate: {
      type: Number,
      required: true,
    },
    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model if applicable
      validate: {
        validator: async function (v) {
          if (!v) {
            return true;
          }
          return !!(await User.findById(v));
        },
      },
    },
    assignedDate: {
      type: Date,
      default: null,
    },
    warrantyInfo: {
      provider: {
        type: String,
      },
      start: {
        type: Date,
      },
      end: {
        type: Date,
      },
    },
    purchaseOrderNumber: {
      type: String,
      trim: true,
    },
    serviceTag: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
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
    maintenanceLogs: [
      {
        date: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for optimization
assetSchema.index({ assetTag: 1, serialNumber: 1 });

// Create a model from the schema and export it
export const Asset = mongoose.model("Asset", assetSchema);
