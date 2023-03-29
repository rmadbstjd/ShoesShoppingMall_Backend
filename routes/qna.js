const express = require("express");
const router = express.Router();
const Qnas = require("../schemas/qna");
const authenticateAccessToken = require("../middleware/authAccessToken");
router.post("/qna/:productId", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;
  const { productId } = req.params;
  const { title, content, isSecret, dates } = req.body;

  const Qna = await Qnas.create({
    userId,
    productId,
    title,
    content,
    isSecret,
    answered: false,
    dates,
  });
  res.json(Qna);
});

router.get("/qna/:productId", async (req, res) => {
  const { productId } = req.params;
  const Qna = await Qnas.find({ productId });
  res.json(Qna);
});
router.put("/qna/:productId", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;
  const { productId } = req.params;
  const { title, content, isSecret, dates, qnaId } = req.body;
  const Qna = await Qnas.updateOne(
    { _id: qnaId },
    {
      userId,
      productId,
      title,
      content,
      isSecret,
      answered: false,
      dates,
    }
  );
  res.json(Qna);
});

router.delete("/qna/:productId", authenticateAccessToken, async (req, res) => {
  const { qnaId } = req.body;
  const Qna = await Qnas.deleteOne({
    _id: qnaId,
  });
  res.json(Qna);
});
module.exports = router;
