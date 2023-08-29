const mongoose=require('mongoose');
const connecton=async()=>{
    try {
       const conn = await mongoose.connect(process.env.CONNECTION);
       console.log("connected to mongoDb" )
    } catch (error) {
        console.log(`Error in mongoDb ${error}`)
    }
};
module.exports=connecton;