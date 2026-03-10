import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const studentSchema = new Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role:{type:String,default:"student"}
});

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Students", studentSchema);