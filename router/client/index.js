const routerProducts = require("./products");
const routerHome = require("./home");
const categoryMiddleware = require("../../middlewares/client/categorymiddleware");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use("/home", routerHome);
  app.use("/products", routerProducts);
};
