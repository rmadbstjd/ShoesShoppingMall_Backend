const express = require("express");
const router = express.Router();
const Reviews = require("../schemas/review");
const Orders = require("../schemas/order");
const Products = require("../schemas/products");
const sessionUserId = require("../app");
router.post("/review", async (req, res) => {
  const userId = sessionUserId.sessionUserId;
  const {
    orderId,
    content,
    rate,
    productId,
    size,
    date,
    coupon,
    price,
    count,
    star,
  } = req.body;

  const exsistsReview = await Reviews.findOne({ orderId });

  if (exsistsReview) {
    await Reviews.deleteOne({ orderId });
  }
  const review = await Reviews.create({
    userId,
    orderId,
    content,
    rate,
    date,
    productId,
    size,
    date,
    coupon,
    price,
    count,
    star,
  });
  await Orders.updateOne({ _id: orderId }, { isReviewd: true });
  res.json(review);
});
router.get("/review", async (req, res) => {
  let infoArr2 = [];
  const userId = sessionUserId.sessionUserId;
  const review = await Reviews.find({ userId });
  for (let i = 0; i < review.length; i++) {
    let info = await Products.findOne({ _id: review[i].productId });
    infoArr2.push({ product: review[i], info: info });
  }

  res.json(infoArr2);
});
router.delete("/review", async (req, res) => {
  const { orderId } = req.body;

  await Orders.updateOne({ _id: orderId }, { isReviewd: false });
  const review = await Reviews.deleteOne({ orderId });

  res.json(review);
});
module.exports = router;
