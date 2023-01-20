const express = require("express");
const mongoose = require("mongoose");
const app = express();

const hostname = "127.0.0.1";
const productsRouter = require("./routes/products");
const likesRouter = require("./routes/likes");
const cartsRouter = require("./routes/cart");
const addressRouter = require("./routes/address");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://thriving-cheesecake-fab559.netlify.app/",
    ], // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);
const MONGO_URL = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: MONGO_DB_NAME,
  })
  .then(() => {
    console.log(`[+] mongoseDB Connection`);
  })
  .catch((err) => console.error(`[-] mongoseDB ERROR :: ${err}`));
app.use("/api", [productsRouter, likesRouter, cartsRouter, addressRouter]);
app.get("/", (req, res) => {
  res.send("hello world!!!");
});

app.listen(port, hostname, () => {
  console.log("server is started!");
});
