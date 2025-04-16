const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  // user_id:String,
  cart_id:String,
  userInfo:{
    fullName:String,
    phone:String,
    address:String,
  },
  products:[
    {
      product_id:String,
      quantity:Number,
      discount:Number,
      price:Number
    }
  ],

},{
  timestamps:true
});

// Đặt tên collection là 'products'
const Order = mongoose.model("orders", orderSchema, "orders");

module.exports = Order;
