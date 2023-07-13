const express = require("express");
const router = express.Router();
const Qnas = require("../schemas/qna");
const Products = require("../schemas/products");
const authenticateAccessToken = require("../middleware/authAccessToken");
router.post(
  "/qna/product/:productId",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const { user } = res.locals;
      const userId = user.id;
      const { productId } = req.params;
      const { title, content, isSecret, dates, image } = req.body;
      console.log(title, content, isSecret, dates, image);
      const Qna = await Qnas.create({
        userId,
        productId,
        title,
        content,
        isSecret,
        isAnswered: false,
        dates,
        image,
      });
      res.status(201).json(Qna);
    } catch (error) {
      console.log("error", error);
    }
  }
);

router.get("/qna/notanswered", async (req, res) => {
  try {
    const QnA = await Qnas.find({ isAnswered: false }).sort({ createdAt: -1 });
    res.status(200).json(QnA);
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/qna/answered", async (req, res) => {
  try {
    const QnA = await Qnas.find({ isAnswered: true }).sort({ createdAt: -1 });
    res.status(200).json(QnA);
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/qna/mypage", authenticateAccessToken, async (req, res) => {
  try {
    const { page } = req.headers;
    const { user } = res.locals;
    const userId = user.id;

    const QnA = await Qnas.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 5)
      .limit(5);
    const QnACount = await Qnas.find({ userId });

    const count = QnACount.length;
    const idArr = [];
    const products = [];
    for (let i = 0; i < QnA.length; i++) {
      idArr.push(QnA[i].productId);
    }
    for (let i = 0; i < idArr.length; i++) {
      const Product = await Products.find({ _id: idArr[i] });
      products.push(Product);
    }
    res.status(200).json({ QnA, products, count });
  } catch (error) {
    console.log("error", error);
  }
});
router.get("/qna/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { page } = req.headers;
    const count = await Qnas.find({ productId });

    const Qna = await Qnas.find({ productId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 5)
      .limit(5);
    res.status(200).json({ Qna, count });
  } catch (error) {
    console.log("error", error);
  }
});

router.put(
  "/qna/product/:productId/:qnaId",
  authenticateAccessToken,
  async (req, res) => {
    try {
      const { user } = res.locals;
      const userId = user.id;
      const { productId, qnaId } = req.params;
      const { title, content, isSecret, dates } = req.body;
      const Qna = await Qnas.updateOne(
        { _id: qnaId },
        {
          userId,
          productId,
          title,
          content,
          isSecret,
          isAnswered: false,
          dates,
        }
      );
      res.status(201).tson(Qna);
    } catch (error) {
      console.log("error", error);
    }
  }
);

router.put("/qna/answer/:qnaId", async (req, res) => {
  try {
    const { qnaId } = req.params;
    const { answer } = req.body;
    const Qna = await Qnas.updateOne(
      { _id: qnaId },
      { answer: answer, isAnswered: true }
    );
    res.status(201).json(Qna);
  } catch (error) {
    console.log("error", error);
  }
});

router.delete("/qna/:qnaId", authenticateAccessToken, async (req, res) => {
  try {
    const { qnaId } = req.params;
    const Qna = await Qnas.deleteOne({
      _id: qnaId,
    });
    res.status(200).json(Qna);
  } catch (error) {
    console.log("error", error);
  }
});
module.exports = router;
