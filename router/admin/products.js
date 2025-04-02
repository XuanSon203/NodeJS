const express = require("express");
const routes = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware");
const productController = require("../../controller/admin/ProductController");
const { createPost } = require("../../validates/admin/productValdate");
const validate = require("../../validates/admin/productValdate");
const upload = multer();

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
  (req, res, next) => {
    console.log("File Multer nhận được:", req.file);
    next();
  },
  validate.createPost,
  productController.editPatch
);
routes.get("/detail/:id", productController.detail);

module.exports = routes;
