const mongoose=require('mongoose');

const StudentSchmea=new mongoose.Schema({
    studentId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    mobile:{
        type: Number,
        reuired: true
    },
    password:{
        type:String
    }
});

module.exports=mongoose.model('Student',StudentSchmea);