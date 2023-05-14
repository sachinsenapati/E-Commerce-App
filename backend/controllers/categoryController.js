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

const getAllCategoryController = async (req, res) => {
  try {
    const categories = await Category.find({});

    res.status(200).send({
      status: true,
      message: "Successfully fetched all categories",
     categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Error in fetching all categories",
      error,
    });
  }
};

const getSingleCategoryController = async (req, res) => {
  try {
    const {slug}=req.params
    const category =await Category.findOne({slug:slug});
    res.status(200).send({
      status: true,
      message: "sucessfully one category details fetched",
      category
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Error in single category",
      error,
    });
  }
};

const updateCategoryController=async(req,res)=>{
try {
  const {name}=req.body;
  const {id}=req.params;
  const  category=await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new :true})
res.status(200).send({status:true,message:"Category updated sucessfully",category})

} catch (error) {
  console.log(error);
  res.status(500).send({
    status:false,
    message:"Error while updating the category",
    error
  })
  
}
}

const deleteCategoryController=async(req,res)=>{
try {
  const {id}=req.params;
  const category=await Category.findByIdAndDelete(id);
  res.status(200).send({
    status:true,
    message:"deleted successfully",
    category
  })
  
} catch (error) {
  console.log(error);
  res.status(500).send({
    status:false,
    message:"Error in deleting a category ",
    error
  })
}
}
module.exports = {
  createCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
