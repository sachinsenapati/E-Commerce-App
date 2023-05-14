const express = require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleWare");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  deleteProduct,
  updateProductController,
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

router.get("/get-product", protect, isAdmin, getProductController);
router.get("/get-product/:slug", protect, isAdmin, getSingleProductController);

router.put(
  "/update-product/:id",
  protect,
  isAdmin,
  formidable(),
  updateProductController
);

router.delete("/del-product/:id", protect, isAdmin, deleteProduct);

module.exports = router;
