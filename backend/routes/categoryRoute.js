const express=require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleWare");
const { createCategoryController } = require("../controllers/categoryController");
const router=express.Router();



//create-category

router.post("/create-category",protect,isAdmin,createCategoryController);

module.exports=router