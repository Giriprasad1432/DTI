import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema({
  studentId: { type: String, required: true ,unique:true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  branch: { type: String, default: 'CSE' },
  year: { type: String, default: '1st Year' },
  role:{type:String,default:"student"}
},{timestamps:true});


export default mongoose.model("Students", studentSchema);