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
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              return reject(error); // Nếu có lỗi, trả về lỗi
            }
            resolve(result); // Nếu thành công, trả về kết quả
          });

          // Tạo một luồng đọc và đẩy nó vào Cloudinary
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      // Lấy kết quả upload và gán vào body
      const result = await streamUpload(req);
      req.body[req.file.fieldname] = result.secure_url; // Lưu URL hình ảnh
    } else {
      // Không có ảnh được tải lên, gán giá trị mặc định vào trường thumbnail
      req.body['thumbnail'] = "URL_ANH_PLACEHOLDER"; // Đảm bảo đây là trường thumbnail, không phải _id
    }

    // Chuyển đến middleware tiếp theo
    next();
  } catch (error) {
    // Log lỗi nếu có vấn đề
    console.error("Error uploading image:", error);
    return res.status(500).send("Error uploading image");
  }
};
