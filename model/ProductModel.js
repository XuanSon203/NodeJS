const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    product__category_id: { type: String, default: "" },
    createdBy: {
      account_id: String,
      createdAt: {
        type: String,
        default: Date.now,
      },
    },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    status: { type: String, default: "Active" },
    deleted: { type: Boolean, default: false },
    deletedBy: {
      account_id: String,
      deletedAt: {
        type: String,
        default: Date,
      },
    },
    position: Number,
    description: String,
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Product = mongoose.model("products", productSchema, "products");

module.exports = Product;
