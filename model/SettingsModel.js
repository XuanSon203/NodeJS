const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingSchema = new Schema(
  {
 websiteName:String,
 logo:String,
 phone:String,
 email:String,
 address:String,
 copyright:String
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Settings = mongoose.model("settings", settingSchema, "settings");

module.exports = Settings;
