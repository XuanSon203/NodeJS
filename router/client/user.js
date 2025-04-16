const express = require('express');
const routes = express.Router();
const userController = require('../../controller/client/UserController');
const validate=  require('../../validates/client/userValudate');
routes.get("/register",userController.register);

routes.post("/register",validate.registerPost,userController.registerPost);
routes.get("/login",userController.login);
routes.post("/login",validate.loginPost,userController.loginPost);
routes.get("/logout",userController.logout);


module.exports = routes;