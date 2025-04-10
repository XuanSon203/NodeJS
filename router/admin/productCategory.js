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
routes.get("/edit/:id", productCategory.edit);
routes.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productCategory.editPatch
);
routes.get("/detail/:id", productCategory.detail);

routes.delete("/delete/:id", productCategory.delete);

module.exports = routes;
