const mongoose = require("mongoose");

const qnaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isSecret: {
      type: Boolean,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    answered: {
      type: Boolean,
      required: true,
    },
    dates: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Qnas", qnaSchema);
