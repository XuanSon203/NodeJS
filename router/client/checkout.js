const express = require('express');
const routes = express.Router();
const checkoutController = require('../../controller/client/CheckoutController')
routes.get("/",checkoutController.index)
routes.post("/order",checkoutController.orderPost)
routes.get("/success/:orderId",checkoutController.success)

module.exports = routes;