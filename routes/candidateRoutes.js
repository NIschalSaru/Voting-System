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
      message: "Candidate created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/edit/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res
        .status(403)
        .json({ message: "Forbidden, User doesn't has admin role!" });

    console.log(req.params.id);
    const candidateID = req.params.id;
    console.log(candidateID);
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

router.get("/get", jwtAuthMiddleware, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    if (!candidates)
      return res.status(404).json({ error: "No candidates found" });

    const candidate = candidates.map((data) => {
      return {
        Name: data.name,
        Party: data.party,
        Age: data.age,
      };
    });
    return res.status(200).json(candidate);
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: "Internal Server Error" });
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

router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    const candidateID = req.params.candidateId;
    const candidate = await Candidate.findById(candidateID);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });

    const userID = req.user.id;
    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isVoted)
      return res.status(403).json({ message: "User has already voted" });

    if (user.role === "voter") {
      candidate.votes.push({
        user: userID,
      });
      candidate.voteCount++;
      await candidate.save();

      user.isVoted = true;
      await user.save();
      return res.status(200).json({ message: "Voted successfully" });
    } else {
      return res.status(403).json({ message: "Only voters can vote" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    const voteResult = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    if (voteResult) return res.status(200).json(voteResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
