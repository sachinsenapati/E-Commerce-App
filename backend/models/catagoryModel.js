const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    unique: true,
  },
  slug:{
    type:String,
    lowerCase:true
  }
});
const Category= mongoose.model("Category",categorySchema);

module.exports=Category;