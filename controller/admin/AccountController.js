const Account = require("../../model/AccountModel");
const Role = require("../../model/RolesModel");
var md5 = require("md5");
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");

  for (const item of records) {
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false,
    });

    item.role = role;
  }

  res.render("admin/pages/accounts/index", { records });
};

// Get
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/create", { roles });
};
// Post
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password);
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", "Email đã tồn tại ");
    res.redirect("back");
  } else {
    const records = new Account(req.body);
    await records.save();
    res.render("admin/pages/accounts/index");
  }
};
// Get
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const roles = await Role.find({ deleted: false });
  const account = await Account.findOne({
    _id: id,
  });
  res.render("admin/pages/accounts/edit", { account, roles });
};
// Patch
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
// Kiểm tra email đã tồn tại hay  chưa 
  const emailExist = await Account.findOne({
    // Sử dung $ne để tìm các id không bằng id này 
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại `);
    res.redirect("back");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cật nhập tài khoản thành công ");
    res.redirect("back");
  }
};
