const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} = require("../controllers/authController");

const express=require('express');
const { protect, isAdmin } = require("../middlewares/authMiddleWare");

const router = express.Router();

//register || Method : POST 

router.post('/register',registerController)


//login || Method : POST 

router.post("/login", loginController);


//forget || Method : POST

router.post("/forgot-password",forgotPasswordController)


//testing || Method : get 

router.get("/testing", protect, isAdmin,testController);


module.exports = router;