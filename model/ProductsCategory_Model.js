const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const productsCategorySchema = new Schema(
  {
    title: { type: String, required: true },
    parent_id: { type: String, default: "" },
    thumbnail: { type: String, required: true },
    status: { type: String, default: "Active" },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    position: Number,
    description: String,
    slug: { type: String, slug: "title", unique: true },
  },
  {
    timestamps: true,
  }
);

// Đặt tên collection là 'products'
const Product = mongoose.model(
  "products-category",
  productsCategorySchema,
  "products-category"
);

module.exports = Product;
