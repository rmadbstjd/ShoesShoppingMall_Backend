const express = require("express");
const router = express.Router();
const Users = require("../schemas/user");
const session = require("express-session");
/*router.post("/signUp", async (req, res) => {
  const { userId, password, nickname } = req.body;
  const newUser = await Users.create({
    userId,
    password,
    nickname,
  });
  res.json({ newUser });
});
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const userInfo = await Users.findOne({ userId, password });
  req.session.save(() => {
    req.session.user = {
      userId: userInfo.userId,
      nickname: userInfo.nickname,
    };
    const data = req.session;
    res.status(200).json({ data });
  });
});*/
module.exports = router;
