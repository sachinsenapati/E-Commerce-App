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
      .select("-photo")
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
      .select("-photo")
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

module.exports = {
  createProductController,
  getProductController,
  getSingleProductController,
  updateProductController,
  deleteProduct,
};
