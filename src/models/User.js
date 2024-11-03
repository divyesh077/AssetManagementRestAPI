import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    usernumber: {
      type: Number,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: false,
      trim: true,
    },
    lastname: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Example role types
      default: "user",
    },
    avtar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//userSchema.index({ usernumber: true });

userSchema.statics.isUsernameTaken = async function (
  username,
  excludeUserId = null
) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isEmailTaken = async function (email, excludeUserId = null) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordMatch = async function (password) {
  try {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
