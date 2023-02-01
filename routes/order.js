const express = require("express");
const router = express.Router();
const Orders = require("../schemas/order");
const Products = require("../schemas/products");
const sessionUserId = require("../app");
router.get("/order", async (req, res) => {
  let infoArr = [];

  const userId = sessionUserId.sessionUserId;
  const products = await Orders.find({ userId, state: "배송중" }); //이때 해당 유저의 products는 주문 정보에 porudctId가 있음
  for (let i = 0; i < products.length; i++) {
    console.log("테스트", products[i].productId);
    let info = await Products.findOne({ _id: products[i].productId });
    console.log("인뽀!", info);
    infoArr.push({ product: products[i], info: info });
  }

  res.json(infoArr);
});
router.get("/order/completed", async (req, res) => {
  let infoArr2 = [];
  const userId = sessionUserId.sessionUserId;
  const products = await Orders.find({ userId, state: "배송완료" });
  for (let i = 0; i < products.length; i++) {
    let info = await Products.findOne({ _id: products[i].productId });
    infoArr2.push({ product: products[i], info: info });
  }
  res.json(infoArr2);
});
router.post("/order", async (req, res) => {
  const userId = sessionUserId.sessionUserId;
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
});
router.put("/order", async (req, res) => {
  const userId = sessionUserId.sessionUserId;
  const { orderId } = req.body;
  const product = await Orders.updateOne(
    { _id: orderId },
    { state: "배송완료" }
  );
  res.json(product);
});
module.exports = router;
