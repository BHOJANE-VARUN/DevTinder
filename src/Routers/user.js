const express = require("express");
const userAuth = require("../middleware/userauth");
const router = express.Router();
const Request = require("./../models/request.js");
const user = require("../models/user.js");
const { default: mongoose } = require("mongoose");

router.get("/received", userAuth, async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.user._id,
      status: "like",
    }).populate("sender", "firstName lastName gender photoUrl");
    res.status(200).json({
      requests,
    });
  } catch (e) {
    res.status(400).json({ message: e });
  }
});
router.get("/connections", userAuth, async (req, res) => {
  try {
    let connnections = await Request.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "firstName emailId")
      .populate("receiver", "firstName emailId");
    // Object id is object. therefore == them will only compare there reference, we have either convert them in string or compare them by .equal method
    connnections = connnections.map((val) =>
      val.sender._id.toString() === req.user._id.toString()
        ? val.receiver
        : val.sender
    );
    res.status(200).json({
      data: connnections,
      yourID: req.user._id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    // Fetch requests to determine who should not appear in the feed
    const result = await Request.find({
      $or: [
        {
          status: { $ne: "like" },
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
        {
          sender: req.user._id,
        },
      ],
    });
    // Create a set of user IDs that should not appear in the feed
    const notInFeed = new Set();
    result.forEach((val) => {
      notInFeed.add(val.sender.toString());
      notInFeed.add(val.receiver.toString());
    });

    // Convert the set to an array of ObjectId
    const excludedIds = Array.from(notInFeed).map((id) =>
     new mongoose.Types.ObjectId(id)
    );
    // Fetch users who are not in the excluded list
    const skips = (req.query.page-1)*2 || 0;
    console.log(req.query.page);
    const data = await user.find({
      $and:[{
      _id: { $nin: excludedIds },
    },{
      _id:{$ne:req.user._id},
    }
    ]}).select("firstName lastName photoUrl skills").skip(skips).limit(2);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in /feed route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
