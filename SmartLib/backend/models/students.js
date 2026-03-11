import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema({
  studentId: { type: String, required: true ,unique:true},
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  role:{type:String,default:"student"}
},{timestamps:true});


export default mongoose.model("Students", studentSchema);