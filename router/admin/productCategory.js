const express = require("express");
const routes = express.Router();
const multer = require("multer");
const productCategory = require("../../controller/admin/ProductCategoryController");
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware");
const validate = require("../../validates/admin/products-categoryValidate");
const upload = multer();

routes.get("/", productCategory.index);
routes.get("/create", productCategory.create);
routes.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productCategory.createPost
);

module.exports = routes;
