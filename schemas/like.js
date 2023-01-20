const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const likesSchema = new mongoose.Schema(
  {
    likeId: {
      type: Number,

      unique: true,
    },
    productId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
likesSchema.plugin(AutoIncrement, { inc_field: "likeId" }); //id는 1,2,3,4..
module.exports = mongoose.model("Likes", likesSchema);
