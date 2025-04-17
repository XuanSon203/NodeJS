const Settings = require("../../model/SettingsModel");
module.exports.general = async (req, res) => {
  const settingGeneral = await Settings.findOne({});
  res.render("admin/pages/settings/general", { settingGeneral });
};
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await Settings.findOne({});
  if (settingGeneral) {
    await Settings.updateOne(
      {
        _id: settingGeneral.id,
      },
      req.body
    );
  } else {
    const records = new Settings(req.body);
    await records.save();
  }
  req.flash("success", "Cập nhật thành công ");
  res.redirect("back");
};
