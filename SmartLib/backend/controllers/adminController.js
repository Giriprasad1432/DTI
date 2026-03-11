import bcrypt from "bcryptjs";
import adminAuth from '../models/AdminAuth.js'
import Admin from "../models/admin.js";

const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ message: "admin ID and password are required" });
    }

    const admins = await adminAuth.findOne({ adminId });
    if (!admins) {
      return res.status(404).json({ message: "admin not found" });
    }

    if (!admins.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const match = await bcrypt.compare(password, admins.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const adminDetails = await Admin.findOne({ adminId });
    let adminData={};
    if (adminDetails) {
      adminData = adminDetails.toObject();
      delete adminData.password;
    }
    else{
      console.log("Admin not completely registered..");
    }
    res.status(200).json({ message: "Login Successful", ...adminData });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminLogin;