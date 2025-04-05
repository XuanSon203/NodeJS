const ProductCategory = require("../../model/ProductsCategory_Model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/create-tree");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  try {
    const productsCategory = await ProductCategory.find(find);
    const categoryTree = createTreeHelper.createTree(productsCategory);
    res.render("admin/pages/product-category/index", {
      productsCategory: categoryTree,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    res.status(500).send("Có lỗi xảy ra!");
  }
};

module.exports.create = async (req, res) => {
  try {
    // Lấy tất cả danh mục chưa bị xóa
    let find = { deleted: false };

    // Hàm đệ quy tạo cây danh mục
    function createTree(arr, parentId = "") {
      const tree = [];
      arr.forEach((item) => {
        if (item.parent_id === parentId) {
          const newItem = item;
          const children = createTree(arr, item.id);
          if (children.length > 0) {
            newItem.children = children;
          }
          tree.push(newItem);
        }
      });
      return tree;
    }

    const categories = await ProductCategory.find(find);
    const categoryTree = createTree(categories);
    console.log(categoryTree);

    // Render view và truyền cả danh sách gốc lẫn cây phân cấp
    res.render("admin/pages/product-category/create", {
      categories: categoryTree,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    res.status(500).send("Lỗi server");
  }
};

// Thêm sản phẩm Post
module.exports.createPost = async (req, res) => {
  // Nếu không nhập vị trí, tự động tăng
  if (!req.body.position) {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position) || 0;
  }
  // Tạo sản phẩm mới
  try {
    const productCategory = new ProductCategory(req.body);
    await productCategory.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi thêm sản phẩm.");
    res.redirect("back");
  }
};
