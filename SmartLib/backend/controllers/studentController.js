import studentAuth from "../models/StudentAuth.js";
import Students from "../models/students.js";
import bcrypt from "bcryptjs";

const studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ message: "Student ID and password are required" });
    }

    const student = await studentAuth.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const studentDetails = await Students.findOne({ studentId });
    let studentData={};
    if (studentDetails) {
      studentData = studentDetails.toObject();
      delete studentData.password;
    }
    else{
      console.log("Students not completely registered..");
    }
    res.status(200).json({ message: "Login Successful", ...studentData });
    
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default studentLogin;