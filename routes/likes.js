const express = require("express");
const router = express.Router();
const Likes = require("../schemas/like");
const Products = require("../schemas/products");
// 유저가 좋아요한 상품 전체 보여주기
router.get("/like/products", async (req, res) => {
  let arr = [];
  let arr2 = [];
  const email = req.headers.email;
  const emails = await Likes.find({ email });
  console.log("emails", emails);
  for (let i = 0; i < emails.length; i++) {
    arr.push(emails[i].productId);
  }

  for (let i = 0; i < arr.length; i++) {
    arr2.push(await Products.find({ _id: arr[i] }));
  }

  res.json({ result: arr2 });
});

//좋아요 누르기
router.post("/like/:productId", async (req, res) => {
  console.log("좋아요 실행!");
  const { productId } = req.params;
  const { email } = req.body;

  const test = await Likes.find({ email: email });

  const pushLike = await Likes.create({ email, productId });
  let likeDone = true;
  for (let i = 0; i < test.length; i++) {
    if (pushLike.email == test[i].email) {
      if (pushLike.productId == test[i].productId) {
        likeDone = false;

        await Likes.deleteMany({
          email: email,
          productId: productId,
        });
      }
    }
  }
  const product = await Likes.find({ productId });

  await Products.updateOne({ _id: productId }, { likeNum: product.length });
  res.json({ result: "success" });
});

// 유저가 해당 제품을 좋아요 눌렀는지 알려주기
router.get("/like/isLike/:productId", async (req, res) => {
  const { productId } = req.params;
  const email = req.headers.email;
  if (!productId) {
    console.log("productId is null");
  }
  const isLike = await Likes.findOne({ productId, email });

  if (isLike) {
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
});

module.exports = router;
