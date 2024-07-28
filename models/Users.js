const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: Number,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  nationalCard_id: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    return isMatch;
  } catch (error) {
    throw error;
  }
};
//Create User model\
const User = mongoose.model("Users", userSchema);
module.exports = User;
