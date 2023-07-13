const express = require("express");
const router = express.Router();
const Carts = require("../schemas/cart");

const authenticateAccessToken = require("../middleware/authAccessToken");

require("dotenv").config();
//해당 유저의 장바구니 조회
router.get("/cart", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    const products = await Carts.find({ userId }).sort({ price: -1 });
    if (products.length === 0) {
      return res.status(200).json({
        success: false,
        errorMessage: "장바구니에 상품이 존재하지 않습니다.",
      });
    } else {
      res.status(200).json({
        success: true,
        products,
      });
    }
  } catch (error) {
    return res.status(500).json();
    console.log("error", error);
  }
});

router.get(
  "/cart/check/products",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const { user } = res.locals;
      const userId = user.id;
      const products = await Carts.find({ userId, isChecked: true }).sort({
        createdAt: -1,
      });
      if (products.length === 0) {
        return res.status(200).json({
          success: "false",
          errorMessage: "장바구니에 상품이 존재하지 않습니다.",
        });
      } else {
        res.status(200).json({
          success: "true",
          products,
        });
      }
    } catch (error) {
      return res.status(500).json();
      console.log("error", error);
    }
  }
);
// 개별 상품 장바구니에 추가
router.post("/cart/:productId", authenticateAccessToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { user } = res.locals;
    const userId = user.id;

    const { product, size, quantity } = req.body;
    const existsCarts = await Carts.find({
      productId: productId,
      userId: userId,
      size: size,
    });
    if (existsCarts.length) {
      return res.status(200).json({
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

    res.status(201).json({ result: "success" });
  } catch (error) {
    console.log("error", error);
  }
});
// 개별 상품 장바구니에서 삭제
router.delete("/cart/:productId", authenticateAccessToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { user } = res.locals;
    const userId = user.id;
    const { size } = req.body;

    const existsCarts = await Carts.deleteOne({
      productId: productId,
      userId: userId,
      size: size,
    });

    if (existsCarts) {
      res.status(200).json({ result: "success" });
    } else {
      res.status(200).json({ result: "false" });
    }
  } catch (error) {
    console.log("error", error);
  }
});

router.put(
  "/cart/check/:productId/",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const { user } = res.locals;
      const userId = user.id;
      const { productId } = req.params;
      const { isChecked } = req.body;
      const product = await Carts.updateOne(
        {
          productId,
          userId,
        },
        {
          isChecked,
        }
      );
      res.status(201).json({ product });
    } catch (error) {
      console.log("error", error);
    }
  }
);

//개별 상품 장바구니 수량 변경
router.put("/cart/:productId", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    const { productId } = req.params;
    const { quantity, size } = req.body;
    await Carts.updateOne(
      {
        productId: productId,
        userId: userId,
        size: size,
      },
      { quantity: quantity }
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = router;
