import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const adminAuthSchema = new Schema({
  adminId: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  role:{type:String,default:"student"}
},
{timestamps:true}
);

adminAuthSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password =await bcrypt.hash(this.password, 10);
});

export default mongoose.model("adminAuth", adminAuthSchema);