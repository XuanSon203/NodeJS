const express = require("express");
const routes = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware");
const upload = multer();
const validate = require("../../validates/admin/accountValidate");
const accountController = require("../../controller/admin/AccountController");
routes.get("/", accountController.index);
routes.get("/create", accountController.create);
routes.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  accountController.createPost
);
routes.get("/edit/:id", accountController.edit);
routes.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  accountController.editPatch
);



module.exports = routes;
