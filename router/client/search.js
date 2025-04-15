const express = require('express');
const routes = express.Router();
const searchController = require('../../controller/client/SearchController')
routes.get("/",searchController.index);

module.exports = routes;