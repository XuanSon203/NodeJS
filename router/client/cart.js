const express = require('express');
const routes = express.Router();
const cartController = require('../../controller/client/CartController')
routes.post("/add/:productId",cartController.addPost);

module.exports = routes;