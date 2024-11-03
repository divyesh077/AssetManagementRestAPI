import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Token = mongoose.model("Token", tokenSchema);
