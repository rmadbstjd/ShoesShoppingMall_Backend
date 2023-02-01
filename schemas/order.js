const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
    required: false,
  },
  size: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Orders", orderSchema);
