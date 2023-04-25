const express = require("express");
const router = express.Router();
const Reviews = require("../schemas/review");
const Orders = require("../schemas/order");
const Products = require("../schemas/products");
const authenticateAccessToken = require("../middleware/authAccessToken");
router.post("/review", authenticateAccessToken, async (req, res) => {
  try {
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
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/review", authenticateAccessToken, async (req, res) => {
  try {
    let infoArr2 = [];
    const { user } = res.locals;
    const userId = user.id;
    const review = await Reviews.find({ userId });

    for (let i = 0; i < review.length; i++) {
      let info = await Products.findOne({ _id: review[i].productId });
      infoArr2.push({ product: review[i], info: info });
    }

    res.json(infoArr2);
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/review/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { page } = req.headers;
    const review = await Reviews.find({ productId }).sort({ createdAt: -1 });
    const count = review.length;
    const reviews = await Reviews.find({ productId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 5)
      .limit(5);
    res.json({ reviews, count });
  } catch (error) {
    console.log("error", error);
  }
});

router.delete("/review", authenticateAccessToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    await Orders.updateOne({ _id: orderId }, { isReviewd: false });
    const review = await Reviews.deleteOne({ orderId });

    res.json(review);
  } catch (error) {
    console.log("error", error);
  }
});
module.exports = router;
