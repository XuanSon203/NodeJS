const routerDashboard = require("./dashboard");
const routerProducts = require("./products");
const systemConfig = require("../../config/system");
const productCategory = require("./productCategory");
const routerRole = require("./roles");
const routerAccount = require('./accounts')
const routerAuth = require('./auth')
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(`${PATH_ADMIN}/dashboard`, routerDashboard);
  app.use(`${PATH_ADMIN}/products`, routerProducts);
  app.use(`${PATH_ADMIN}/products-category`, productCategory);
  app.use(`${PATH_ADMIN}/roles`, routerRole);
  app.use(`${PATH_ADMIN}/accounts`, routerAccount);
  app.use(`${PATH_ADMIN}/auth`, routerAuth);
};
