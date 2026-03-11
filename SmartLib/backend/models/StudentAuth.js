import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const studentAuthSchema = new Schema({
  studentId: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  role:{type:String,default:"student"}
},
{timestamps:true}
);

studentAuthSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password =await bcrypt.hash(this.password, 10);
});

export default mongoose.model("studentAuth", studentAuthSchema);