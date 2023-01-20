const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    postCode: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressDetail: {
      type: String,
    },
    phoneNumber1: {
      type: String,
    },
    phoneNumber2: {
      type: String,
    },
    phoneNumber3: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
