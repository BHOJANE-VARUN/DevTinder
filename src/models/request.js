const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "like"],
        message: "Invalid status type",
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request",requestSchema);

module.exports = Request;


