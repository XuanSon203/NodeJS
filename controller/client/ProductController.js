const Product = require('../../model/ProductModel');
module.exports.index= async(req,res)=>{
  let find={
    deleted:false
  }
const products = await Product.find(find).sort({position:"desc"});
    res.render("client/page/products/index",{
        pageTitle:'Products',
        products
    })
}
module.exports.detail = async (req, res) => {
  const slug= req.params.slug;
  let find = {
    deleted: false,
    slug: slug,
  };
  const product = await Product.findOne(find);
  res.render("client/page/products/detail.pug", {
    product,
  });
};
