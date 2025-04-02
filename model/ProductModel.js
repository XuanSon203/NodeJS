const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    status: { type: String, default: "Active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Product = mongoose.model("products", productSchema, "products");

module.exports = Product;
