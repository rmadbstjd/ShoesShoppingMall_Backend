const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Users = require("../schemas/user");
const authenticateAccessToken = require("../middleware/authAccessToken");

router.post("/signUp", async (req, res) => {
  const { userId, password, nickname } = req.body;
  const existUser = await Users.findOne({ userId });
  if (existUser) return res.status(201).json();

  const createUser = await Users.create({
    userId,
    password,
    nickname,
  });
  return res.status(200).json({ createUser });
});

router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const user = await Users.findOne({ userId, password });
  const userInfo = await Users.findOne({ userId }).select(
    "-_id userId nickname"
  );
  if (!user) return res.status(201).json();
  if (user) {
    res.locals.user = user;
    let accessToken = generateAccessToken(user.userId, userInfo.nickname);
    let refreshToken = generateRefreshToken(user.userId, userInfo.nickname);
    res.json({ userInfo, accessToken, refreshToken });
  }
});

//
// access token을 secret key 기반으로 생성
const generateAccessToken = (id, nickname) => {
  return jwt.sign({ id, nickname }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id, nickname) => {
  return jwt.sign({ id, nickname }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "180 days",
  });
};
// access token 유효성 확인을 위한 예시 요청
router.get("/user", authenticateAccessToken, async (req, res) => {
  const { user } = res.locals;
  const userId = user.id;

  const userInfo = await Users.findOne({ userId }).select(
    "-_id userId nickname"
  );
  res.json({ isAuth: true, userInfo });
});

// access token을 refresh token 기반으로 재발급
router.post("/refresh", (req, res) => {
  let refreshToken = req.headers["authorization"];

  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(401);

    const accessToken = generateAccessToken(user.id, user.nickname);

    res.json({ accessToken });
  });
});

module.exports = router;
