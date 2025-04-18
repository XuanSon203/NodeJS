const routerDashboard = require("./dashboard");
const routerProducts = require("./products");
const systemConfig = require("../../config/system");
const productCategory = require("./productCategory");
const routerRole = require("./roles");
const routerAccount = require("./accounts");
const authMiddleware = require("../../middlewares/admin/authMiddleware");
const routerAuth = require("./auth");
const myAccountRouter = require("./my-account");
const routerSettings = require('./setting')
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    `${PATH_ADMIN}/dashboard`,
    authMiddleware.requireAuth,
    routerDashboard
  );
  app.use(`${PATH_ADMIN}/products`, authMiddleware.requireAuth, routerProducts);
  app.use(
    `${PATH_ADMIN}/products-category`,
    authMiddleware.requireAuth,
    productCategory
  );
  app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, routerRole);
  app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, routerAccount);
  app.use(
    `${PATH_ADMIN}/my-account`,
    authMiddleware.requireAuth,
    myAccountRouter
  );
  app.use(`${PATH_ADMIN}/auth`, routerAuth);
  app.use(`${PATH_ADMIN}/settings`,authMiddleware.requireAuth, routerSettings);
};
