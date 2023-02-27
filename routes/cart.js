const express = require("express");
const router = express.Router();
const Carts = require("../schemas/cart");
const sessionUserId = require("../app");
let asd = 0;
require("dotenv").config();
//해당 유저의 장바구니 조회
router.get("/cart", async (req, res) => {
  asd++;

  if (Object.keys(sessionUserId).length !== 0) {
    userId = sessionUserId.sessionUserId;
    const products = await Carts.find({ userId }).sort({ createdAt: -1 });
    if (products.length === 0) {
      return res.json({
        success: "false",
        errorMessage: "장바구니에 상품이 존재하지 않습니다.",
      });
    } else {
      res.json({
        success: "true",
        products,
      });
    }
  } else {
  }
});
// 개별 상품 장바구니에 추가
router.post("/carts/:productId", async (req, res) => {
  const { productId } = req.params;

  const userId = sessionUserId.sessionUserId;
  const { product, size, quantity } = req.body;
  const existsCarts = await Carts.find({
    productId: productId,
    userId: userId,
    size: size,
  });
  if (existsCarts.length) {
    return res.json({
      success: false,
      errorMessage: "이미 장바구니에 존재하는 상품입니다.",
    });
  }
  await Carts.create({
    productId: productId,
    userId: userId,
    size: size,
    quantity: quantity,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
  });

  res.json({ result: "success" });
});
// 개별 상품 장바구니에서 삭제
router.delete("/carts/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = sessionUserId.sessionUserId;
  const { size } = req.body;

  const existsCarts = await Carts.deleteOne({
    productId: productId,
    userId: userId,
    size: size,
  });

  if (existsCarts) {
    res.json({ result: "success" });
  } else {
    res.json({ result: "false" });
  }
});
let count = 0;
//개별 상품 장바구니 수량 변경
router.put("/carts/:productId", async (req, res) => {
  count++;

  const userId = sessionUserId.sessionUserId;
  const { productId } = req.params;
  const { quantity, size } = req.body;

  const existsCarts = await Carts.updateOne(
    {
      productId: productId,
      userId: userId,
      size: size,
    },
    { quantity: quantity }
  );

  res.json({ success: true });
});

module.exports = router;
