const express=require("express");


const { protect, isAdmin } = require("../middlewares/authMiddleWare");
const { createCategoryController, updateCategoryController, deleteCategoryController, getAllCategoryController, getSingleCategoryController } = require("../controllers/categoryController");
const router=express.Router();



//create-category

// router.post("/create-category",protect,isAdmin,createCategoryController);

router.post("/create-category", protect, createCategoryController);


//get categoty
// router.get("/getall-category", protect, isAdmin, getAllCategoryController);

router.get("/getall-category",getAllCategoryController);

//singCategory
router.get(
  "/single-category/:slug",
  
  getSingleCategoryController
);

// update category
router.put("/update-category/:id", protect, isAdmin, updateCategoryController);

// delete category
router.delete("/delete-category/:id", protect, isAdmin, deleteCategoryController);


module.exports=router