const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware");
const productController = require("../../controller/admin/ProductController");
const upload = multer();

const routes = express.Router();
const myAccountController = require("../../controller/admin/MyAccountController");
routes.get("/", myAccountController.index);
routes.get("/edit", myAccountController.edit);
routes.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  myAccountController.editPatch
);
module.exports = routes;
