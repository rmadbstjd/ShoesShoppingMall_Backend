const express = require("express");
const app = express();
const port = 3001;
const connect = require("./schemas");
const productsRouter = require("./routes/products");
const likesRouter = require("./routes/likes");
const cartsRouter = require("./routes/cart");
const addressRouter = require("./routes/address");
const cors = require("cors");
app.use(express.json());
connect();
app.use(
  cors({
    origin: "http://localhost:3000", // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);
app.use("/api", [productsRouter, likesRouter, cartsRouter, addressRouter]);
app.get("/", (req, res) => {
  res.send("hello world!!!");
});

app.listen(port, () => {
  console.log("server is started!");
});
