const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: { type: String, required: true, trim: true, uppercase: true },
    lastName: { type: String, required: true, trim: true, uppercase: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: { type: Number, min: 0, required: true },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      uppercase: true,
      required: true,
    },
    address: { type: String, required: true, trim: true },
    weight: { type: Number, min: 0, default: null}, // Patient specific
    specialization: { type: String, trim: true, default: null }, // Doctor specific
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["DOCTOR", "PATIENT"],
      uppercase: true,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
