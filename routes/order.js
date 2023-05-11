const express = require("express");
const router = express.Router();
const Orders = require("../schemas/order");
const Products = require("../schemas/products");

const authenticateAccessToken = require("../middleware/authAccessToken");
router.get("/order", authenticateAccessToken, async (req, res) => {
  try {
    let infoArr = [];
    const { user } = res.locals;
    const userId = user.id;
    const products = await Orders.find({ userId, state: "배송중" });

    //이때 해당 유저의 products는 주문 정보에 porudctId가 있음
    for (let i = 0; i < products.length; i++) {
      let info = await Products.findOne({ _id: products[i].productId });

      infoArr.push({ product: products[i], info: info });
    }

    res.json(infoArr);
  } catch (error) {
    console.log("error", error);
  }
});
router.get("/order/completed", authenticateAccessToken, async (req, res) => {
  try {
    let infoArr2 = [];
    const { user } = res.locals;
    const userId = user.id;
    const products = await Orders.find({
      userId,
      state: "배송완료",
    });
    for (let i = 0; i < products.length; i++) {
      let info = await Products.findOne({ _id: products[i].productId });
      infoArr2.push({ product: products[i], info: info });
    }
    res.json(infoArr2);
  } catch (error) {
    console.log("error", error);
  }
});
router.get("/order/notreviewd", authenticateAccessToken, async (req, res) => {
  try {
    let infoArr2 = [];
    const { user } = res.locals;
    const userId = user.id;
    const products = await Orders.find({
      userId,
      state: "배송완료",
      isReviewd: false,
    });
    for (let i = 0; i < products.length; i++) {
      let info = await Products.findOne({
        _id: products[i].productId,
      });
      infoArr2.push({ product: products[i], info: info, state: "notReviewd" });
    }
    infoArr2.reverse();
    res.json(infoArr2);
  } catch (error) {
    console.log("error", error);
  }
});
router.post("/order", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    const { productId, date, count, state, coupon, size } = req.body;

    await Orders.create({
      productId,
      userId,
      date,
      count,
      state,
      coupon,
      size,
    });
    res.json({ result: "success" });
  } catch (error) {
    console.log("error", error);
  }
});
router.put("/order", authenticateAccessToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    const product = await Orders.updateOne(
      { _id: orderId },
      { state: "배송완료" }
    );
    res.json(product);
  } catch (error) {
    console.log("error", error);
  }
});
module.exports = router;
