const express = require("express");
const router = express.Router();
const Reviews = require("../schemas/review");
const Orders = require("../schemas/order");
const Products = require("../schemas/products");
const authenticateAccessToken = require("../middleware/authAccessToken");
router.post("/review", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;
  const {
    image,
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
    image,
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

router.get("/review", authenticateAccessToken, async (req, res) => {
  let infoArr2 = [];
  const { user } = res.locals;
  const userId = user.id;
  const review = await Reviews.find({ userId });

  for (let i = 0; i < review.length; i++) {
    let info = await Products.findOne({ _id: review[i].productId });
    infoArr2.push({ product: review[i], info: info });
  }

  res.json(infoArr2);
});

router.get("/review/:productId", async (req, res) => {
  const { productId } = req.params;
  const reviews = await Reviews.find({ productId });
  res.json(reviews);
});

router.delete("/review", authenticateAccessToken, async (req, res) => {
  const { orderId } = req.body;

  await Orders.updateOne({ _id: orderId }, { isReviewd: false });
  const review = await Reviews.deleteOne({ orderId });

  res.json(review);
});
module.exports = router;
