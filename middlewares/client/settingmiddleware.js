const systemConfig = require("../../config/system");
const SettingsGeneral = require("../../model/SettingsModel");
module.exports.settingGeneral = async (req, res, next) => {
  const settingGeneral = await SettingsGeneral.findOne({});
  res.locals.settingGeneral = settingGeneral;
  next();
};
