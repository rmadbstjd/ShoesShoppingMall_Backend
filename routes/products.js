const express = require("express");
const router = express.Router();
const Products = require("../schemas/products");

// 상품 검색 자동 완성
router.post("/search/autocompleted", async (req, res) => {
  try {
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
  } catch (error) {
    console.log("error", error);
  }
});
// 상품 검색
router.get("/search", async (req, res) => {
  try {
    const { keyword, sort, collectionName, priceOrder, page, offset } =
      req.query;
    const regex = (pattern) => new RegExp(`.*${pattern}.*`);
    let keywordRegex = regex(keyword);
    const collectionNameArr =
      (collectionName && collectionName.split(",")) || [];
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
      case "popular":
        let popularProducts = sortedProductsArr.sort(function (a, b) {
          if (a.likeNum > b.likeNum) return -1;
          if (a.likeNum < b.likeNum) return 1;

          return 0;
        });

        count = popularProducts.length;
        products = popularProducts.slice((page - 1) * offset, page * offset);
        return res.json({ products, count });
      case "new":
        let newProducts = sortedProductsArr.sort(function (a, b) {
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
          return 0;
        });
        count = newProducts.length;
        products = newProducts.slice((page - 1) * offset, page * offset);
        return res.json({ products, count });
      case "highprice":
        let highPriceProducts = sortedProductsArr.sort(function (a, b) {
          if (a.price > b.price) return -1;
          if (a.price < b.price) return 1;
          return 0;
        });
        count = highPriceProducts.length;
        products = highPriceProducts.slice((page - 1) * offset, page * offset);
        return res.json({ products, count });
      case "lowprice":
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
  } catch (error) {
    console.log("error", error);
  }
});
// 관리자가 등록한 브랜드 이름 리턴
router.get("/products/brandsName", async (req, res) => {
  try {
    brands = await Products.find().select(["category", "-_id"]);
    let newBrandsName = [];
    let brandsNameArr = [];
    for (let i = 0; i < brands.length; i++) {
      newBrandsName.push(brands[i].category[0]);
    }
    brandsNameArr = [...new Set(newBrandsName)];

    res.json(brandsNameArr);
  } catch (error) {
    console.log("error", error);
  }
});

//모든 상품 전체 조회
router.get("/products/all", async (req, res) => {
  try {
    const { page } = req.headers;

    const products = await Products.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * 5)
      .limit(5);
    const countArr = await Products.find({});
    const count = countArr.length;
    res.json({ products, count });
  } catch (error) {
    console.log("error", error);
  }
});

//전체 상품 조회(최신순)
router.post("/products/orderByNew", async (req, res) => {
  try {
    const { currentPage } = req.body;

    let productsArr = [];
    for (let i = 1; i <= currentPage; i++) {
      const products = await Products.find()
        .sort({ createdAt: -1 })
        .skip((i - 1) * 5)
        .limit(5);
      productsArr.push(products);
    }
    res.json(productsArr);
  } catch (error) {
    console.log("error", error);
  }
});

// 전체 상품 조회(인기순)
router.post("/products/orderByPopular", async (req, res) => {
  try {
    const { currentPage } = req.body;

    let productsArr = [];
    for (let i = 1; i <= currentPage; i++) {
      const products = await Products.find()
        .sort({ likeNum: -1 })
        .sort({ createdAt: 1 })
        .skip((i - 1) * 5)
        .limit(5);
      productsArr.push(products);
    }
    res.json(productsArr);
  } catch (error) {
    console.log("error", error);
  }
});

//전체 상품 조회(유니크순)
router.post("/products/orderByUnique", async (req, res) => {
  try {
    const { currentPage } = req.body;
    let productsArr = [];
    for (let i = 1; i <= currentPage; i++) {
      const products = await Products.find({ sort: "unique" })
        .sort({ createdAt: 1 })
        .skip((i - 1) * 5)
        .limit(5);
      productsArr.push(products);
    }
    res.json(productsArr);
  } catch (error) {
    console.log("error", error);
  }
});
// 같은 카테고리 상품 조회
router.post("/products/similar", async (req, res) => {
  try {
    const { category, productId } = req.body;
    const products = await Products.find({ category, _id: { $ne: productId } })
      .sort({ likeNum: -1 })
      .limit(5);
    res.json(products);
  } catch (error) {
    console.log("error", error);
  }
});

// 상품 추가
router.post("/products", async (req, res) => {
  try {
    const { name, image, category, size, description, price } = req.body;
    const cateogryArr = category.split(",");
    const createdProduct = await Products.create({
      name,
      image,
      category: cateogryArr,
      size,
      description,
      price: price.replace(/,/g, ""),
    });

    res.json({ product: createdProduct });
  } catch (error) {
    console.log("error", error);
  }
});
// 상품 수정
router.put("/products", async (req, res) => {
  try {
    const { name, image, category, size, description, price, productId } =
      req.body;

    const editedProduct = await Products.updateOne(
      { _id: productId },
      {
        name,
        image,
        category,
        size,
        description,
        price: price.replace(/,/g, ""),
      }
    );
    res.json({ product: editedProduct });
  } catch (error) {
    console.log("error", error);
  }
});

router.delete("/products", async (req, res) => {
  try {
    const { productId } = req.body;
    const Product = await Products.deleteOne({
      _id: productId,
    });
    res.json(Product);
  } catch (error) {
    console.log("error", error);
  }
});
// 개별 상품 조회
router.get("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Products.findOne({ _id: productId });
    if (product) res.json({ product });
  } catch (error) {
    res.json({ error: true });
  }
});

module.exports = router;
