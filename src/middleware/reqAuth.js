const User = require("../models/user");

const reqAuth = async (req, res, next) => {
  try {
    // check if status is valid or not
    const validStatus = ["ignored", "like"];
    if (!validStatus.includes(req.params.status)) {
      return res.status(400).json({ message: "invalid request type" });
    }

    // first check that receiver exists or not
    const receiver = await User.findById(req.params.id);
    if (!receiver) {
      return res.status(400).json({ error: "Receiver not found" });
    }

    // check if sender and receiver are same
    if (req.user._id.toString() === req.params.id) {
      return res
        .status(400)
        .json({ error: "Sender and receiver can not be same" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: e });
  }
};

module.exports = reqAuth;
