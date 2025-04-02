const mongoose = require('mongoose');
module.exports.connect = async(req,res)=>{
  try {
   await mongoose.connect("mongodb+srv://pxuanson203:15112003@cluster0.ae8y4.mongodb.net/demo");
    console.log('Connect successfully');
  } catch (error) {
    console.log('Faile',error);
  }
}