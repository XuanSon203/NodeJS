const routerProducts = require("./products");
const routerHome = require("./home");
const categoryMiddleware = require("../../middlewares/client/categorymiddleware");
const routerSearch = require('./search');
const cartMiddleware = require('../../middlewares/client/cartmiddleware');
const cartRouter = require('./cart');
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use("/home", routerHome);
  app.use("/products", routerProducts);
  app.use("/search", routerSearch);
  app.use("/cart", cartRouter);
};
