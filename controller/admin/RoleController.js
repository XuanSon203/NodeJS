const Role = require("../../model/RolesModel");
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const roles = await Role.find(find);
  console.log(roles);
  res.render("admin/pages/roles/index", {
    roles,
  });
};
// Get Create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create");
};
// Post Create
module.exports.createPost = async (req, res) => {
  const records = new Role(req.body);
  records.save();
  res.redirect("/admin/roles");
};
// Get Edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit", { data });
  } catch (error) {
    res.redirect("/admin/roles/index");
  }
};
// Get Create
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    res.redirect("/admin/roles");
  } catch (error) {
    res.redirect("/admin/roles");
  }
};
// Delete
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, { deleted: true });
    res.redirect("/admin/roles");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/roles");
  }
};
// Get Detail
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/detail", { data });
  } catch (error) {
    res.redirect("/admin/roles/index");
  }
};
// Get Permissiom
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", { records });
};
// Patch Permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    const id = item.id;
    const permissions = item.permissions;
    await Role.updateOne({ _id: id }, { permissions: permissions });
  }
  req.flash('success',"Cật nhập phân quyền thành công ")
  res.redirect('back');
};
