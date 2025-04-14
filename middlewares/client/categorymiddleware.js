const ProductCategory = require("../../model/ProductsCategory_Model");
const createTreeHelper = require("../../helper/create-tree");

module.exports.category =async (req, res, next) => {
  let find = {
    deleted: false,
  };
    const productsCategory = await ProductCategory.find(find);
    const categoryTree = createTreeHelper.createTree(productsCategory);
    res.locals.productsCategory =categoryTree;
  next();
};
