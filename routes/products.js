const express = require("express");
const router = express.Router();
const Products = require("../schemas/products");

// 상품 검색
router.get("/search", async (req, res) => {
  const { keyword, sort, collectionName, priceOrder } = req.query;

  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  let keywordRegex = regex(keyword);
  const collectionNameArr = (collectionName && collectionName.split(",")) || [];
  const priceOrderArr = (priceOrder && priceOrder.split(",")) || [];

  const productsArr = [];
  let products;
  // 1. keyword가 null일때, 전체 상품 보여주기 (검색 X)
  //이때 collectionName을
  if (keyword === "") {
    products = await Products.find({});
    if (collectionNameArr.length !== 0) {
      for (let i = 0; i < collectionNameArr.length; i++) {
        if (priceOrderArr.length === 0) {
          products = await Products.find({
            category: collectionNameArr[i], // 나이키
          });
          productsArr.push(products);
        }
        if (priceOrderArr.includes("1")) {
          products = await Products.find({
            category: collectionNameArr[i],
          }).lte("price", 200000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("2")) {
          products = await Products.find({
            category: collectionNameArr[i],
          })
            .gte("price", 200000)
            .lte("price", 400000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("3")) {
          products = await Products.find({
            category: collectionNameArr[i],
          })
            .gte("price", 400000)
            .lte("price", 600000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("4")) {
          products = await Products.find({
            category: collectionNameArr[i],
          }).gte("price", 600000);

          productsArr.push(products);
        }
      }

      return res.json(productsArr);
    } else {
      if (priceOrderArr.length === 0) productsArr.push(products);
      else {
        if (priceOrderArr.length === 0) {
          products = await Products.find({});
          productsArr.push(products);
        }
        if (priceOrderArr.includes("1")) {
          products = await Products.find({}).lte("price", 200000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("2")) {
          products = await Products.find({})
            .gte("price", 200000)
            .lte("price", 400000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("3")) {
          products = await Products.find({})
            .gte("price", 400000)
            .lte("price", 600000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("4")) {
          products = await Products.find({}).gte("price", 600000);

          productsArr.push(products);
        }
      }
      res.json(productsArr);
    }
  } else {
    if (collectionNameArr.includes(keyword)) {
      if (priceOrderArr.length === 0) {
        products = await Products.find().or([
          {
            name: { $regex: keywordRegex, $options: "i" },
          },
          {
            category: { $regex: keywordRegex, $options: "i" },
          },
          {
            description: { $regex: keywordRegex, $options: "i" },
          },
        ]);
        productsArr.push(products);
        return res.json(productsArr);
      } else {
        if (priceOrderArr.includes("1")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .lte("price", 200000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("2")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .gte("price", 200000)
            .lte("price", 399999);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("3")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .gte("price", 400000)
            .lte("price", 599999);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("4")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .gte("price", 600000);
          productsArr.push(products);
        }
      }
      return res.json(productsArr);
    } else if (collectionNameArr.length === 0) {
      if (priceOrderArr.length === 0) {
        products = await Products.find().or([
          {
            name: { $regex: keywordRegex, $options: "i" },
          },
          {
            category: { $regex: keywordRegex, $options: "i" },
          },
          {
            description: { $regex: keywordRegex, $options: "i" },
          },
        ]);
        productsArr.push(products);
      } else if (priceOrderArr.length !== 0) {
        if (priceOrderArr.includes("1")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .lte("price", 200000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("2")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .gte("price", 200000)
            .lte("price", 400000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("3")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .gte("price", 400000)
            .lte("price", 600000);
          productsArr.push(products);
        }
        if (priceOrderArr.includes("4")) {
          products = await Products.find()
            .or([
              {
                name: { $regex: keywordRegex, $options: "i" },
              },
              {
                category: { $regex: keywordRegex, $options: "i" },
              },
              {
                description: { $regex: keywordRegex, $options: "i" },
              },
            ])
            .gte("price", 600000);
          productsArr.push(products);
        }
      }
      res.json(productsArr);
    }
  }
  //1-1) keyword = null인 상태에서 collectionName을 눌렀을 경우
  //1-2) keyword = null인 상태에서 collectionName과 priceOrder를 눌렀을 경우
  //1-3 ) keyword = null인 상태에서 prieOrder를 눌렀을 경우
  //1-4 ) keyword = null인 상태에서 priceOrder와 collectionName을 눌렀을 경우

  //2. keyword가 존재하는 경우, (검색 O) EX 나이키, 아디다스 ...
  //2-1) keyword = 존재하는 상태에서 collectionName을 눌렀을 경우
  //2-2) keyword = 존재하는  상태에서 collectionName과 priceOrder를 눌렀을 경우
  //2-3 ) keyword =존재하는  상태에서 prieOrder를 눌렀을 경우
  //2-4 ) keyword = 존재하는  상태에서 priceOrder와 collectionName을 눌렀을 경우

  //3. keyword가 존재하지 않는 경우
});
// 관리자가 등록한 브랜드 이름 리턴
router.get("/products/brandsName", async (req, res) => {
  brands = await Products.find().select(["category", "-_id"]);
  const arr = [];
  for (let i = 0; i < brands.length; i++) {
    arr.push(brands[i].category);
  }
  const set = new Set(arr);
  const uniqueArr = [...set];
  res.json(uniqueArr);
});

//모든 상품 전체 조회
router.get("/products/all", async (req, res) => {
  const products = await Products.find({});
  res.json(products);
});

//전체 상품 조회(최신순)
router.post("/products/orderByNew", async (req, res) => {
  const { currentPage } = req.body;

  const products = await Products.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * 5)
    .limit(5);
  res.json(products);
});
// 전체 상품 조회(인기순)
router.post("/products/orderByPopular", async (req, res) => {
  const { currentPage } = req.body;

  const products = await Products.find()
    .sort({ likeNum: -1 })
    .skip((currentPage - 1) * 5)
    .limit(5);
  res.json(products);
});
// 같은 카테고리 상품 조회
router.post("/products/similar", async (req, res) => {
  const { category, productId } = req.body;
  if (!productId) {
  }
  const products = await Products.find({ category }).limit(5);
  const arr = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i]._id != productId) {
      arr.push(products[i]);
    }
  }

  res.json(arr);
});
// 상품 추가
router.post("/products", async (req, res) => {
  const { name, image, category, size, description, price } = req.body;

  const createdProduct = await Products.create({
    name,
    image,
    category,
    size,
    description,
    price: price.replace(/,/g, ""),
  });

  res.json({ product: createdProduct });
});
// 개별 상품 조회
router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = await Products.findOne({ _id: productId });
  res.json({ product });
});

module.exports = router;
