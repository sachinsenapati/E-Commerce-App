const mongoose=require('mongoose');
const connecton=async()=>{
    try {
       const conn=await mongoose.connect("mongodb://localhost:27017/ecommerce");
       console.log("connected to mongoDb" )
    } catch (error) {
        console.log(`Error in mongoDb ${error}`)
    }
};
module.exports=connecton;