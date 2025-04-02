const routerProducts = require('./products');
module.exports =(app)=>{
  app.use('/products',routerProducts)
}