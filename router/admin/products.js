const express = require("express");
const routes = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware");
const upload = multer();
const productController = require("../../controller/admin/ProductController");
const validate = require("../../validates/admin/productValdate");
routes.get("/", productController.index);
routes.patch("/change-status/:status/:id", productController.chageStatus);
routes.patch("/change-multi", productController.changeMulti);
routes.delete("/delete/:id", productController.deleteItem);
routes.get("/create", productController.create);
routes.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productController.createPost
);
routes.get("/edit/:id", productController.edit);
routes.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productController.editPatch
);
routes.get("/detail/:id", productController.detail);

module.exports = routes;
