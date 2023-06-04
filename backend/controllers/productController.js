const { default: slugify } = require("slugify");
const fs = require("fs");

const Product = require("../models/productModel");
const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.fields;
    const { photo } = req.files;

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).send({
        status: false,
        message: "All fields are required",
      });
    }

    if (!photo) {
      return res.status(400).send({
        status: false,
        message: "Photo is required",
      });
    }

    if (photo.size > 1000000) {
      return res.status(400).send({
        status: false,
        message: "Photo size must be <= 1MB",
      });
    }

    const existingProduct = await Product.findOne({ slug: slugify(name) });
    if (existingProduct) {
      return res.status(400).send({
        status: false,
        message: "Product already exists",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      slug: slugify(name),
      photo: {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      },
    });

    await product.save();

    res.status(201).send({
      status: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Unable to create the product",
      error,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    const product = await Product.find({})
      .populate("category")
      // .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({ status: true, message: "All Product fetched", product,totalCount:product.length });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      Message: "Error while fetching all products",
      error,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({slug:req.params.slug}).populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res
      .status(200)
      .send({
        status: true,
        message: "Single Product fetched",
        product,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      Message: "Error while fetching single product",
      error,
    });
  }
};


 const productPhotoController = async (req, res) => {
   try {
     const product = await Product.findById(req.params.pid).select("photo");
     if (product && product.photo && product.photo.data) {
       res.set("Content-type", product.photo.contentType);
       return res.status(200).send(product.photo.data);
     } else {
       return res.status(404).send({
         success: false,
         message: "Photo not found",
       });
     }
   } catch (error) {
     console.log(error);
     res.status(500).send({
       success: false,
       message: "Error while getting photo",
       error,
     });
   }
 };


const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.fields;
    const { photo } = req.files;

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).send({
        status: false,
        message: "All fields are required",
      });
    }

    if (!photo) {
      return res.status(400).send({
        status: false,
        message: "Photo is required",
      });
    }

    if (photo.size > 1000000) {
      return res.status(400).send({
        status: false,
        message: "Photo size must be <= 1MB",
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id,{
      name,
      description,
      price,
      quantity,
      category,
      slug: slugify(name),
      photo: {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      },
    },{new:true});


    res.status(201).send({
      status: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Unable to update the product",
      error,
    });
  }
};

const deleteProduct=async(req,res)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id);
        res.status(200).send({
            status:true,
            message:"sucessfully deleted the produc",
            product
        })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: false,
        Message: "Error while deleting a product",
        error,
      });
    }

}



 const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log(checked)
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    console.log(args)
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
 const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
 const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await Product
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
 const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
 const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await Product.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
module.exports = {
  createProductController,
  getProductController,
  productPhotoController,
  getSingleProductController,
  updateProductController,
  deleteProduct,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
  productCategoryController,
};
