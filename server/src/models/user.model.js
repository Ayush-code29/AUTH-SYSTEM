import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can contain only lowercase letters, numbers, and underscores",
      ],
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.passwordChangedAt;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.passwordChangedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving a new password.
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  this.passwordHash = await bcrypt.hash(
    this.passwordHash,
    10
  );

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

// Compare the entered password with the stored hash.
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.passwordHash) {
    throw new Error(
      "Password hash is not selected. Use .select('+passwordHash')"
    );
  }

  return bcrypt.compare(password, this.passwordHash);
};
// Generate short-lived access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      sub: this._id.toString(),
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_TTL,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    }
  );
};

// Generate a cryptographically secure opaque refresh token
userSchema.methods.generateRefreshToken = function () {
  return crypto.randomBytes(64).toString("hex");
};

export const User = mongoose.model("User", userSchema);
