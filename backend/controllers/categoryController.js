const Category  = require("../models/catagoryModel");
const slugify = require("slugify")
const createCategoryController = async (req, res) => {
  try {
    const {name}=req.body;
    if(!name){
        return res.status(401).send({message:"Name is required"});
    }
    const existingCategory=await Category.findOne({name})
    if(existingCategory){
        return res.status(200).send({sucess:true,message:"Category exist"})
    }
    const category=await new Category({name,slug:slugify(name)}).save()
    res.status(201).send({
        status:true,
        message:"new category created",
        category
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in category",
    });
  }
};

module.exports = { createCategoryController };
