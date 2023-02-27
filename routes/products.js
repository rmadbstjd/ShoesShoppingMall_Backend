const express = require("express");
const router = express.Router();
const Products = require("../schemas/products");
const Cart = require("../schemas/cart");

// 상품 검색
router.get("/search", async (req, res) => {
  const { keyword, sort, collectionName, priceOrder } = req.query;

  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  let keywordRegex = regex(keyword);
  const arr = (collectionName && collectionName.split(",")) || [];
  const parr = (priceOrder && priceOrder.split(",")) || [];
  const arr2 = [];
  const parr2 = [];
  const allarr = [];
  arr2.push(keyword);

  if (keyword === "null" && collectionName === undefined) {
    let product;
    if (parr.length !== 0) {
      for (let i = 0; i < parr.length; i++) {
        parr2.push(parr[i]);
      }
      const pset = new Set(parr2);
      const parr3 = [...pset];
      let arr5 = [];

      for (let i = 0; i < parr3.length; i++) {
        const priceOrder1 = parr3[i];

        switch (priceOrder1) {
          case "0":
            product = await Products.find().or([
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

            arr5.push(product);
            break;

          case "1":
            product = await Products.find({}).lte("price", 200000);

            arr5.push(product);
            break;

          case "2":
            product = await Products.find({})
              .gte("price", 200000)
              .lte("price", 400000);

            arr5.push(product);
            break;
          case "3":
            product = await Products.find({})
              .gte("price", 400000)
              .lte("price", 600000);

            arr5.push(product);
            break;
          case "4":
            product = await Products.find({}).gte("price", 600000);

            arr5.push(product);
            break;
          default:
            product = await Products.find();

            arr5.push(product);
            break;
        }
      }

      res.json({ products: arr5 });
      return;
    } else if (sort === "new") {
      const products = await Products.find({}).sort({ createdAt: -1 });
      allarr.push(products);
      res.json({ products: allarr });
      return;
    }
    const products = await Products.find({}).sort({ likeNum: -1 });
    allarr.push(products);
    res.json({ products: allarr });
    return;
  }
  if (collectionName !== undefined) {
    for (let i = 0; i < arr.length; i++) {
      arr2.push(arr[i]);
    }
  }
  if (priceOrder !== undefined) {
    for (let i = 0; i < parr.length; i++) {
      parr2.push(parr[i]);
    }
  } else if (priceOrder === undefined) {
    parr2.push("0");
  }
  const set = new Set(arr2);
  const pset = new Set(parr2);
  const arr3 = [...set];
  const parr3 = [...pset];
  const arr4 = [];
  const parr4 = [];
  for (let i = 0; i < arr3.length; i++) {
    arr4.push(regex(arr3[i]));
  }
  for (let i = 0; i < parr3.length; i++) {
    parr4.push(parr3[i]);
  }
  let products;
  let arr5 = [];
  let sortOrder;
  for (let i = 0; i < arr4.length; i++) {
    keywordRegex = arr4[i];
    if (sort === "new") {
      sortOrder = "createdAt";
    } else if (sort === "popular") {
      sortOrder = "likeNum";
    }

    for (let i = 0; i < parr3.length; i++) {
      const priceOrder1 = parr3[i];

      switch (priceOrder1) {
        case "0":
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
            .sort(`-${sortOrder}`);

          arr5.push(products);
          break;
        case "1":
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
            .sort(`-${sortOrder}`)
            .lte("price", 200000);

          arr5.push(products);
          break;
        case "2":
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
            .sort(`-${sortOrder}`)
            .gte("price", 200000)
            .lte("price", 400000);

          arr5.push(products);
          break;
        case "3":
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
            .sort(`-${sortOrder}`)
            .gte("price", 400000)
            .lte("price", 600000);

          arr5.push(products);
          break;
        case "4":
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
            .sort(`-${sortOrder}`)
            .gte("price", 600000);

          arr5.push(products);
          break;
        default:
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
            .sort(`-${sortOrder}`);
          arr5.push(products);
          break;
      }
    }
  }
  res.json({ products: arr5.reverse(), sort });
});
// 관리자가 등록한 브랜드 이름 리턴
router.get("/products/brandsName", async (req, res) => {
  console.log("실행됨?");
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
  console.log("products", products);
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
