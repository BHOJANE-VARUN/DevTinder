const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const userAuth = require("../middleware/userauth");
const reqAuth = require("../middleware/reqAuth");

router.post("/:status/:id", userAuth, reqAuth, async (req, res) => {
  try {
    const relation = req.params.status;
    if (relation === "like") {
      const obj = await Request.findOne({
        $or: [
          {
            sender: req.params.id,
            receiver: req.user._id,
          },
          {
            sender: req.user._id,
            receiver: req.params.id,
          },
        ],
      });
      //console.log(obj);
      if (obj) {
        if (obj.status === "like" && obj.sender===req.params.id) {
          obj.status = "accepted";
          await obj.save();
          return res.status(200).json({ message: "Got a match" });
        } else if (obj.status === "accepted" || obj.sender===req.user._id) {
          return res.status(400).json({ message: "already a match or request sented" });
        } else {
          return res
            .status(200)
            .json({ message: "sorry, you deserve someone better" });
        }
      } else {
        const newRelation = new Request({
          sender: req.user._id,
          receiver: req.params.id,
          status: "like",
        });
        await newRelation.save();
        return res.status(200).json({ message: "you liked someone" });
      }
    } else {
      // ignored someone
      const obj = Request.findOne({
        $or: [
          {
            sender: req.params.id,
            receiver: req.user._id,
          },
          {
            sender: req.user._id,
            receiver: req.params.id,
          },
        ],
      });
      if (obj) {
        if (obj.status === "like" && obj.sender===req.params.id) {
          obj.status = "rejected";
          await obj.save();
          return res.status(200).json({ message: "you rejected someone" });
        } else if (obj.status === "accepted") {
            obj.status = "rejected";
          return res.status(400).json({ message: "you removed the connection" });
        } else {
          return res
            .status(200)
            .json({ message: "you both ignored each other or you already ignored him/her" });
        }
      } else {
        const newRelation = new Request({
          sender: req.user._id,
          receiver: req.params.id,
          status: "ignored",
        });
        await newRelation.save();
        return res.status(200).json({ message: "you ignored someone" });
      }
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

module.exports = router;
