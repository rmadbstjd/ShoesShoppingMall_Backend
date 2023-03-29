const express = require("express");
const router = express.Router();
const Products = require("../schemas/products");

// 상품 검색 자동 완성
router.post("/search/autocompleted", async (req, res) => {
  const { keyword } = req.body;
  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  let keywordRegex = regex(keyword);
  let newBrandsName = [];
  const brandsName = await Products.find()
    .or([
      {
        category: { $regex: keywordRegex, $options: "i" },
      },
    ])
    .select("-_id category");
  for (let i = 0; i < brandsName.length; i++) {
    console.log("new", brandsName[i].category);
    newBrandsName.push(brandsName[i].category);
  }
  let uniqueArr = newBrandsName.filter((element, index) => {
    return (
      //1차원 배열에서는 indexOf를 사용했지만 다차원 배열에서는 안먹힘
      newBrandsName.findIndex(
        (item) => item[0] === element[0] && item[1] === element[1]
      ) === index
    );
  });
  const products = await Products.find()
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
    .sort({ likeNum: -1 })
    .limit(10);
  res.json({ products: products, brands: uniqueArr });
});
// 상품 검색
router.get("/search", async (req, res) => {
  const { keyword, sort, collectionName, priceOrder, page, offset } = req.query;
  console.log("페이지", page);
  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  let keywordRegex = regex(keyword);
  const collectionNameArr = (collectionName && collectionName.split(",")) || [];
  const priceOrderArr = (priceOrder && priceOrder.split(",")) || [];

  const productsArr = [];
  let products;
  // 1. keyword가 null일때, 전체 상품 보여주기 (검색 X)
  if (keyword === "") {
    products = await Products.find({});
    if (collectionNameArr.length !== 0) {
      // 브랜드를 체크했을 때
      for (let i = 0; i < collectionNameArr.length; i++) {
        if (priceOrderArr.length === 0) {
          //가격 필터링을 아무 것도 체크 안했을 때
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
    } else {
      // 브랜드를 체크 아무 것도 체크 안했을 때

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
  } else {
    // keywor가 존재할 때
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
    } else if (collectionNameArr.length === 0) {
      //나이키를 검색하고 필터링 브랜드에서 아무 것도 체크 안했을 때
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
    }
  }
  let sortedData;
  let sortedProductsArr = [];
  for (let i = 0; i < productsArr.length; i++) {
    sortedData = productsArr[i];
    for (let i = 0; i < sortedData.length; i++) {
      sortedProductsArr.push(sortedData[i]);
    }
  }
  let count;
  switch (sort) {
    case "0":
      let popularProducts = sortedProductsArr.sort(function (a, b) {
        if (a.likeNum > b.likeNum) return -1;
        if (a.likeNum < b.likeNum) return 1;

        return 0;
      });

      count = popularProducts.length;
      products = popularProducts.slice((page - 1) * offset, page * offset);
      return res.json({ products, count });
    case "1":
      let newProducts = sortedProductsArr.sort(function (a, b) {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
      count = newProducts.length;
      products = newProducts.slice((page - 1) * offset, page * offset);
      return res.json({ products, count });
    case "2":
      let highPriceProducts = sortedProductsArr.sort(function (a, b) {
        if (a.price > b.price) return -1;
        if (a.price < b.price) return 1;
        return 0;
      });
      count = highPriceProducts.length;
      products = highPriceProducts.slice((page - 1) * offset, page * offset);
      return res.json({ products, count });
    case "3":
      let lowPriceProducts = sortedProductsArr.sort(function (a, b) {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      });
      count = lowPriceProducts.length;
      products = lowPriceProducts.slice((page - 1) * offset, page * offset);
      return res.json({ products, count });
    default:
      break;
  }
});
// 관리자가 등록한 브랜드 이름 리턴
router.get("/products/brandsName", async (req, res) => {
  brands = await Products.find().select(["category", "-_id"]);
  let newBrandsName = [];
  let brandsNameArr = [];
  for (let i = 0; i < brands.length; i++) {
    newBrandsName.push(brands[i].category[0]);
  }
  brandsNameArr = [...new Set(newBrandsName)];

  res.json(brandsNameArr);
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
