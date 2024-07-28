const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);

    const response = await newUser.save();
    console.log("data saved successfully");

    const payload = {
      id: response.id,
    };

    const token = generateToken(payload);

    console.log("Token is:", token);
    res.status(200).json({
      message: "User created successfully",
      Token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//login Route
router.post("/login", async (req, res) => {
  try {
    const { nationalCard_id, password } = req.body;
    const user = await User.findOne({ nationalCard_id });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);
    return res.json({
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await User.findById(user.id);
    return res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user; //Extract user id from JWT token
    const { currentPassword, newPassword } = req.body; //Extract current and new password from request body

    const user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.password = newPassword;
    await user.save();
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("data updated successfully");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
