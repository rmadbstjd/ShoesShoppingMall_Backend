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
const port = 3000;

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
app.use("/api", [productsRouter, likesRouter, cartsRouter, addressRouter]);
app.get("/", (req, res) => {
  res.send("hello world!!!");
});

app.listen(port, hostname, () => {
  console.log("server is started!");
});
