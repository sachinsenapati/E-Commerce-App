const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/helper");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  console.log(req.body)
  const { name, email, password, phone, address, question } = req.body;
  try {
    if (!name || !email || !password || !phone || !address || !question) {
      return res.send({ error: "all fields are required" });
    }
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.send({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      question,
    }).save();
    res.status(201).send({
      sucess: true,
      message: "user registered sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      sucess: false,
      message: "error in reg",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        sucess: false,
        message: "Invalid Email or Password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        sucess: false,
        message: "Invalid Email",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        sucess: false,
        message: "invalid email or password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "7d",
    });
    res.status(200).send({
      sucess: true,
      message: "Login sucessfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role:user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ sucess: false, message: "Error in login", error });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, password } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!question) {
      res.status(400).send({
        message: "Question is required",
      });
    }
    if (!password) {
      res.status(400).send({
        message: "New Password is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "Wrong Email or Password" });
    }
    const hashedPassword = await hashPassword(password);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    res
      .status(200)
      .send({ status: true, message: "Password Reset Sucessfully" });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      status: false,
      error,
      message: "Something went wrong",
    });
  }
};

const testController = async (req, res) => {
  res.send({message:"Hello im protected",success:true});
};
module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
};
