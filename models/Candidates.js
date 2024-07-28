const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// Define the User schema
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      votedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

//Create User model\
const Candidates = mongoose.model("Candidates", candidateSchema);
module.exports = Candidates;
