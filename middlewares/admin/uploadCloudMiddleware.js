const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configuration CLoudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports.upload = async (req, res, next) => {
  try {
    if (req.file) {
      // Ảnh được tải lên, tiến hành xử lý
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      let result = await streamUpload(req);
      req.body[req.file.fieldname] = result.secure_url;
    } else {
      // Không có ảnh được tải lên, gán giá trị mặc định
      req.body['thumbnail'] = "URL_ANH_PLACEHOLDER";
    }
    next();
  } catch (error) {
 
    console.error("Error uploading image:", error);
    return res.status(500).send("Error uploading image");
  }
};
