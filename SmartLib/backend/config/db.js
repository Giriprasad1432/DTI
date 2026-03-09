const mongoose=require('mongoose')
const connectDB=async ()=>{
    try{
        const conn=await mongoose.connect('mongodb address',{useNewUrlParser:true});
        console.log("mongoDB connected")
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
}

module.exports={connectDB};
