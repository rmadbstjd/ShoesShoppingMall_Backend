const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Users = require("../schemas/user");
const authenticateAccessToken = require("../middleware/authAccessToken");

router.post("/signUp", async (req, res) => {
  try {
    const { userId, password, nickname } = req.body;
    const existUser = await Users.findOne({ userId });
    if (existUser) return res.status(400).json();

    const createUser = await Users.create({
      userId,
      password,
      nickname,
    });
    return res.status(201).json({ createUser });
  } catch (error) {
    console.log("error", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await Users.findOne({ userId, password });
    const userInfo = await Users.findOne({ userId }).select(
      "-_id userId nickname"
    );

    if (!user) return res.json({ isLogin: false });
    if (user) {
      res.locals.user = user;
      let accessToken = generateAccessToken(user.userId, userInfo.nickname);
      let refreshToken = generateRefreshToken(user.userId, userInfo.nickname);
      await Users.updateOne({ userId }, { token: refreshToken });
      res.json({ userInfo, accessToken, refreshToken });
    }
  } catch (error) {
    console.log("error", error);
  }
});

router.post("/logout", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    await Users.updateOne({ userId }, { token: "" });
    res.json({});
  } catch (error) {
    console.log("error", error);
  }
});

//
// access token을 secret key 기반으로 생성
const generateAccessToken = (id, nickname) => {
  return jwt.sign({ id, nickname }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id, nickname) => {
  return jwt.sign({ id, nickname }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "14d",
  });
};
// access token 유효성 확인을 위한 예시 요청
router.get("/user", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    const userInfo = await Users.findOne({ userId }).select(
      "-_id userId nickname"
    );
    res.json({ isAuth: true, userInfo });
  } catch (error) {
    console.log("error", error);
  }
});

router.get("/user/admin", async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;

    if (userId === process.env.ADMIN_ID) {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  } catch (error) {
    console.log("error", error);
  }
});
// access token을 refresh token 기반으로 재발급
router.post("/refresh", async (req, res) => {
  try {
    const { userId, userNickName } = req.body;
    let refreshToken = req.headers["authorization"];
    if (!refreshToken) return res.sendStatus(401);

    const userRefreshToken = await Users.findOne({ userId }).select(
      "-_id token"
    );
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error) => {
        if (error) {
          await Users.updateOne({ userId }, { token: "" });
          res.json({ isSuccess: false });
        } else if (refreshToken === userRefreshToken?.token) {
          //
          const accessToken = generateAccessToken(userId, userNickName);
          res.json({ isSuccess: true, accessToken });
        } else {
          await Users.updateOne({ userId }, { token: "" });
          res.json({ isSuccess: false });
        }
      }
    );
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = router;
