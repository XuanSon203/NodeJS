const routerProducts = require("./products");
const routerHome = require("./home");
const categoryMiddleware = require("../../middlewares/client/categorymiddleware");
const routerSearch = require('./search');
const cartMiddleware = require('../../middlewares/client/cartmiddleware');
const cartRouter = require('./cart');
const checkoutRouter = require('./checkout')
const routerUser = require('./user')
const userMiddleware = require('../../middlewares/client/usemiddleware')
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use("/home", routerHome);
  app.use("/products", routerProducts);
  app.use("/search", routerSearch);
  app.use("/cart", cartRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/user", routerUser);
};
