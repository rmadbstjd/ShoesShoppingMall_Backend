const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Users = require("../schemas/user");
const authenticateAccessToken = require("../middleware/authAccessToken");
router.post("/signup", async (req, res) => {
  try {
    const { userId, password, nickname } = req.body;

    const existUser = await Users.findOne({ userId });
    if (existUser) return res.status(409).json();
    const hashed = await bcrypt.hash(password, 10);
    const createUser = await Users.create({
      userId,
      password: hashed,
      nickname,
    });
    return res.status(201).json({ createUser });
  } catch (error) {
    res.status(500).json();
    console.log("error", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await Users.findOne({ userId });
    if (!user) return res.status(400).json();
    if (user) {
      const isEqualPw = await bcrypt.compare(password, user.password);
      if (isEqualPw) {
        res.locals.user = user;
        let accessToken = createAccessToken(user.userId, user.nickname);
        let refreshToken = createRefreshToken(user.userId, user.nickname);
        await Users.updateOne({ userId }, { token: refreshToken });
        return res.status(200).json({ user, accessToken, refreshToken });
      } else {
        return res.status(400).json();
      }
    }
  } catch (error) {
    res.status(500).json();
    console.log("error", error);
  }
});

router.post("/logout", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;

    const logoutUser = await Users.updateOne({ userId }, { token: "" });
    if (logoutUser) return res.status(200).json();
    else res.status(400).json();
  } catch (error) {
    res.status(500).json();
    console.log("error", error);
  }
});

//
// access token을 secret key 기반으로 생성
const createAccessToken = (id, nickname) => {
  const role = id === process.env.ADMIN_ID ? "admin" : "user";
  console.log("role", role);
  return jwt.sign({ id, nickname, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

// refersh token을 secret key  기반으로 생성
const createRefreshToken = (id, nickname) => {
  return jwt.sign({ id, nickname }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "14d",
  });
};
// access token 유효성 확인을 위한 예시 요청
router.get("/user/token", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    const userInfo = await Users.findOne({ userId }).select(
      "-_id userId nickname"
    );
    if (userInfo) res.status(200).json({ isAuth: true, userInfo });
    else res.status(400).json();
  } catch (error) {
    res.status(500).json();
    console.log("error", error);
  }
});

router.get("/user/admin", authenticateAccessToken, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user.id;
    if (userId === process.env.ADMIN_ID) {
      res.status(200).json({ isAdmin: true });
    } else {
      res.status(400).json({ isAdmin: false });
    }
  } catch (error) {
    res.status(500).json();
    console.log("error", error);
  }
});
// access token을 refresh token 기반으로 재발급
router.post("/refresh", async (req, res) => {
  try {
    const { userId, userNickName } = req.body;
    let refreshToken = req.headers["authorization"];
    if (!refreshToken) return res.sendStatus(401).json();
    const userRefreshToken = await Users.findOne({ userId });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error) => {
        if (error) {
          await Users.updateOne({ userId }, { token: "" });
          res.status(400).json({ isSuccess: false });
        } else if (refreshToken === userRefreshToken?.token) {
          //
          const accessToken = createAccessToken(userId, userNickName);
          res.status(200).json({ isSuccess: true, accessToken });
        } else {
          await Users.updateOne({ userId }, { token: "" });

          res.status(400).json({ isSuccess: false });
        }
      }
    );
  } catch (error) {
    res.status(500).json();
    console.log("error", error);
  }
});

module.exports = router;
