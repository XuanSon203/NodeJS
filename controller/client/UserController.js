const User = require("../../model/UserModel");
const md5 = require("md5");
const generateHelper = require("../../helper/generate");
const ForgotPassword = require("../../model/Forgot-PasswordModel");
const sendMailHelper = require("../../helper/send-email");
module.exports.register = async (req, res) => {
  res.render("client/page/user/register");
};

module.exports.registerPost = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const exitsEmail = await User.findOne({
    email: email,
    deleted: false,
  });
  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại ");
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/home");
};
module.exports.login = async (req, res) => {
  res.render("client/page/user/login");
};
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại ");
    res.redirect("back");
    return;
  }
  if (password != user.password) {
    req.flash("error", "Sai mật khẩu  ");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản này đang bị khóa   ");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/home");
};
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/home");
};
module.exports.forgotPassword = async (req, res) => {
  res.render("client/page/user/forgot-password");
};
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại ");
    res.redirect("back");
    return;
  }
  //1. ! Tạo mã OTP và lưu OTP, thông tin yêu cầu gửi về email  vào collecttion
  const otp = generateHelper.generateRandomNumber(6);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // 2. Gửi mã OTP qua email của user
  const subject = "Mã OTP lấy lại mật khẩu ";
  const html = `
    Mã OTP lấy lại mật khẩu là <b>${otp}</b>.Thời hạn sử dụng là 3 phút . Không chia sẻ mã này cho bất kì ai 
  `;
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/forgot-password/otp?email=${email}`);
};
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/page/user/otp-password", {
    email,
  });
};
module.exports.otpPasswordPost = async (req, res) => {
  console.log(req.body);

  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "Otp không đúng  ");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
module.exports.resetPassword = async (req, res) => {
  res.render("client/page/user/reset-password");
};
module.exports.resetPasswordPost = async (req, res) => {
  const password = md5(req.body.password);
  const tokenUser = req.cookies.tokenUser;
  console.log(tokenUser);
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: password,
    }
  );
  req.flash("success", "Đổi mật khẩu thành công ");
  res.redirect("/home");
};
