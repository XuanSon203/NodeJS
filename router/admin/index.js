const routerDashboard = require("./dashboard");
const routerProducts = require("./products");
const systemConfig = require("../../config/system");
const productCategory= require('./productCategory')
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(`${PATH_ADMIN}/dashboard`, routerDashboard);
  app.use(`${PATH_ADMIN}/products`, routerProducts);
  app.use(`${PATH_ADMIN}/products-category`, productCategory);
};
