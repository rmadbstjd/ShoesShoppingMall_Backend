const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  star: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Reviews", reviewSchema);
