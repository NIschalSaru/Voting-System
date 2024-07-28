const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidates");
const User = require("../models/Users");
const { jwtAuthMiddleware } = require("../jwt");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user.role === "admin") return true;
  } catch (error) {
    return false;
  }
};

router.post("/create", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    console.log(userData);
    if (!(await checkAdminRole(req.user.id))) {
      console.log(req.user.id);
      return res
        .status(403)
        .json({ message: "Forbidden, User doesn't has admin role!" });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();
    console.log("data saved successfully");

    res.status(200).json({
      response: response,
      message: "Candidat created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/edit/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res
        .status(403)
        .json({ message: "Forbidden, User doesn't has admin role!" });

    const candidateID = req.params.id;
    const updateData = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("data updated successfully");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res
        .status(403)
        .json({ message: "Forbidden, User doesn't has admin role!" });

    const candidateID = req.params.id;
    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate Deleted successfully!!");
    res.status(200).json({ message: "Candidate deleted sucessfully!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
