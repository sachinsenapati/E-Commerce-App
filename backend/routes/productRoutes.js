const express = require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleWare");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  deleteProduct,
  updateProductController,
  productPhotoController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
  productCategoryController,
} = require("../controllers/productController");
const router = express.Router();
const formidable = require("express-formidable");
//
router.post(
  "/create-product",
  protect,
  isAdmin,
  formidable(),
  createProductController
);

router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);
router.get("/get-singleProductPhoto/:pid", productPhotoController);


router.put(
  "/update-product/:id",
  protect,
  isAdmin,
  formidable(),
  updateProductController
);

router.delete("/del-product/:id", protect, isAdmin, deleteProduct);

router.post("/product-filter", productFiltersController);

router.get("/product-count", productCountController);

router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);


module.exports = router;
