const express = require("express");
const routes = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware");
const upload = multer();
const settingController = require("../../controller/admin/SettingController");
routes.get("/general", settingController.general);
routes.patch("/general",upload.single('logo'),uploadCloud.upload, settingController.generalPatch);

module.exports = routes;