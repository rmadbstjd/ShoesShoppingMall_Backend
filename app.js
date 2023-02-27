const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const productsRouter = require("./routes/products");
const likesRouter = require("./routes/likes");
const cartsRouter = require("./routes/cart");
const addressRouter = require("./routes/address");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const reviewRouter = require("./routes/review");
require("dotenv").config();
const port = 3001;
const Users = require("./schemas/user");
const FileStore = require("session-file-store")(session);
exports.sessionUserId;
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://jade-kitten-8b5131.netlify.app/",
    ], // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);

app.use(
  session({
    name: "session ID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false, // https하려면 true
      secure: false, //이것도 나중에 true로
    },
  })
);
//sesion 받아오는 로직
app.get("/session", (req, res) => {
  res.status(200).json("session info");
});

app.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const userInfo = await Users.findOne({ userId, password });
  if (!userInfo) {
    return res.status(201).json();
  }
  if (userInfo) {
    //session 설정

    req.session.save(() => {
      req.session.user = {
        userId: userInfo.userId,
        nickname: userInfo.nickname,
      };
      const data = req.session;

      exports.sessionUserId = data.user.userId;
      res.status(200).json({ data });
    });
  }
});
app.use("/api", [
  productsRouter,
  likesRouter,
  cartsRouter,
  addressRouter,
  userRouter,
  orderRouter,
  reviewRouter,
]);
app.post("/signUp", async (req, res) => {
  const { userId, password, nickname } = req.body;
  const existsUser = await Users.findOne({ userId });
  if (existsUser) {
    return res.status(201).json();
  }
  const newUser = await Users.create({
    userId,
    password,
    nickname,
  });
  return res.status(200).json({ newUser });
});
app.get("/login/success", async (req, res) => {
  try {
    const data = req.session;

    res.status(200).json(data);
  } catch (error) {
    res.status(403).json("user not found!");
  }
});
app.post("/logout", async (req, res) => {
  //session destory
  req.session.destroy(() => {
    res.status(200).json({ message: "logout success!" });
  });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://shoppingMall:kys3421!@cluster0.fpbuo.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Shoes_ShoppingMall",
    }
  )
  .then(() => {
    console.log(`[+] mongoseDB Connection`);
  })
  .catch((err) => console.error(`[-] mongoseDB ERROR :: ${err}`));

app.listen(port, () => {
  console.log("server is started!");
});
module.exports = app;
