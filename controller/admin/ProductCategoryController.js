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
// Get Edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const data = await ProductCategory.findOne(find);
    const productsCategory = await ProductCategory.find({ deleted: false });
    const categoryTree = createTreeHelper.createTree(productsCategory);
    res.render("admin/pages/product-category/edit", {
      data,
      categories: categoryTree,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
// Patch Edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne({ _id: id }, req.body);
    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};
// Get Detail
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };
    const productsCategory = await ProductCategory.find({ deleted: false });
    const categoryTree = createTreeHelper.createTree(productsCategory);
    const productCategory = await ProductCategory.findOne(find);
    res.render("admin/pages/product-category/detail", {
      data: productCategory,
      categories: categoryTree,
    });
  } catch (error) {}
};
// Delete
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, { deleted: true });
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
