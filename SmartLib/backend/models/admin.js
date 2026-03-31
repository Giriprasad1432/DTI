import mongoose from "mongoose";

const { Schema } = mongoose;

const adminSchema = new Schema({
  adminId: { type: String, required: true,unique:true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  role:{type:String,default:"admin"}
},{timestamps:true});


export default mongoose.model("Admin", adminSchema);