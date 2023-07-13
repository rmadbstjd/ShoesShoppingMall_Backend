const express = require("express");
const router = express.Router();
const Likes = require("../schemas/like");
const Products = require("../schemas/products");
const authenticateAccessToken = require("../middleware/authAccessToken");
// 유저가 좋아요한 상품 전체 보여주기
router.get("/products/like", authenticateAccessToken, async (req, res) => {
  try {
    let arr = [];
    let arr2 = [];
    const { user } = res.locals;
    const userId = user.id;

    let userIds = await Likes.find({ userId });

    for (let i = 0; i < userIds.length; i++) {
      arr.push(userIds[i].productId);
    }

    arr = arr.filter((id) => id !== "undefined");

    for (let i = 0; i < arr.length; i++) {
      let product = await Products.findOne({ _id: arr[i] });
      if (product !== null) arr2.push(product);
    }
    res.status(200).json(arr2);
  } catch (error) {
    console.log("error", error);
  }
});

//좋아요 누르기
router.post(
  "/product/:productId/like",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { user } = res.locals;
      const userId = user.id;
      const test = await Likes.find({ userId });
      const pushLike = await Likes.create({ userId, productId });

      let likeDone = true;
      for (let i = 0; i < test.length; i++) {
        if (pushLike.userId === test[i].userId) {
          if (pushLike.productId === test[i].productId) {
            likeDone = false;

            await Likes.deleteMany({
              userId,
              productId: productId,
            });
          }
        }
      }
      const product = await Likes.find({ productId });
      await Products.updateOne({ _id: productId }, { likeNum: product.length });
      res.status(201).json({ result: "success" });
    } catch (error) {
      console.log("error", error);
    }
  }
);

// 유저가 해당 제품을 좋아요 눌렀는지 알려주기
router.get(
  "/product/:productId/like",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { user } = res.locals;
      const userId = user.id;
      if (!productId) {
      }
      const isLike = await Likes.findOne({ productId, userId });

      if (isLike) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
);

module.exports = router;
