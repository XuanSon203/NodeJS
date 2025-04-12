const routerDashboard = require("./dashboard");
const routerProducts = require("./products");
const systemConfig = require("../../config/system");
const productCategory = require("./productCategory");
const routerRole = require("./roles");
const routerAccount = require("./accounts");
const authMiddleware = require("../../middlewares/admin/authMiddleware");
const routerAuth = require("./auth");
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
  app.use(`${PATH_ADMIN}/auth`, routerAuth);
};
