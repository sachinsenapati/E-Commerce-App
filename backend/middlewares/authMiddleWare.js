const User = require("../models/userModel");

const JWT = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = JWT.verify(token, process.env.JWT_SECRETE);
    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
const isAdmin = async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.roll !== 1) {
      res.status(401).send({
        sucess: false,
        message: "Unauthorized User",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      sucess: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
module.exports = { protect, isAdmin };
