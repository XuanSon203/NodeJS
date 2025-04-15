const Product = require("../../model/ProductModel");
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  console.log(keyword);
  let newProduct = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: keywordRegex,
      status: "Active",
      deleted: false,
    });

    newProduct = products;
  }
  res.render("client/page/search/index", {
    keyword: keyword,
    products: newProduct,
  });
};
