const Product = require("../../model/ProductModel");
const ProductCategory = require("../../model/ProductsCategory_Model");
const searchHelper = require("../../helper/seach");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/create-tree");
const Account = require("../../model/AccountModel");
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm sản phẩm dùng regex để có thể tìm kiếm theo các ký tự có trong tên sản phẩm
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const countProducts = await Product.countDocuments(find);
  // Pagination
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts
  );
  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Pagination

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem) // Giới hạn số lượng sản phẩm hiển thị trên 1 trang
    .skip(objectPagination.skip);
  for (const product of products) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = product.updatedBy[product.updatedBy.length - 1];
    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
      
    }
    console.log(product)
  }
  res.render("admin/pages/products/index", {
    pageTitle: "Products",
    products,
    search: objectSearch.search,
    pagination: objectPagination,
  });
};
// Patch ChangeStatus
module.exports.chageStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Product.updateOne(
    {
      _id: id,
    },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash("success", "Cập nhật trạng thái thành công ");

  res.redirect("back");
};
// Patch ChangeMulti and xóa nhiều sản phẩm
const mongoose = require("mongoose");

module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    let ids = req.body.ids;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    // Phân tách chuỗi thành mảng nếu nó là chuỗi
    if (typeof ids === "string") {
      ids = ids.split(",");
    }

    // Chuyển đổi từng ID thành ObjectId
    const objectIds = ids
      .map((id) => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch (error) {
          return null; // Bỏ qua các ID không hợp lệ
        }
      })
      .filter((objectId) => objectId !== null);
    switch (type) {
      case "Active":
        await Product.updateMany(
          { _id: { $in: objectIds } },
          { status: "Active", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Active`
        );

        break;
      case "Inactive":
        await Product.updateMany(
          { _id: { $in: objectIds } },
          { status: "Inactive", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái thành công ${ids.length} sản phẩm thành Inactive`
        );
        break;
      case "deleteAll":
        await Product.updateMany(
          { _id: { $in: objectIds } },
          {
            deleted: true, // Lấy ra thônng tin người xóa
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);

        break;
      case "change-position":
        for (const item of ids) {
          let [id, position] = item.split("-");
          id = id.trim(); // Loại bỏ khoảng trắng
          position = parseInt(position);

          // Kiểm tra nếu id hợp lệ mới thực hiện update
          if (mongoose.Types.ObjectId.isValid(id)) {
            await Product.updateOne(
              { _id: id },
              { position: position, $push: { updatedBy: updatedBy } }
            );
            req.flash(
              "success",
              `Thay đổi thành công vị trí  ${ids.length} sản phẩm`
            );
          } else {
            console.error(`Invalid ObjectId: ${id}`);
          }
        }
        break;

      default:
        return res.status(400).send("Invalid type");
    }

    res.redirect("back");
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).send("Internal Server Error");
  }
};
// Xóa mềm
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        // Lấy ra thônng tin người xóa
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", `Sản phẩm đã được xóa thành công`);

    res.redirect("back");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
// Thêm sản phẩm GET
module.exports.create = async (req, res) => {
  const productsCategory = await ProductCategory.find({ deleted: false });
  const categoryTree = createTreeHelper.createTree(productsCategory);
  res.render("admin/pages/products/create.pug", {
    categories: categoryTree,
  });
};
// Thêm sản phẩm Post
module.exports.createPost = async (req, res) => {
  // Chuyển đổi giá trị số
  req.body.price = parseInt(req.body.price) || 0;

  // Nếu không nhập vị trí, tự động tăng
  if (!req.body.position) {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position) || 0;
  }

  // Tạo sản phẩm mới
  try {
    // In ra thông tin người tạo và thời gian tạo của sản phẩm
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi thêm sản phẩm.");
    res.redirect("back");
  }
};
// Sửa sản phẩm GET
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  let find = {
    deleted: false,
    _id: id,
  };
  const product = await Product.findOne(find);
  const productsCategory = await ProductCategory.find({ deleted: false });
  const categoryTree = createTreeHelper.createTree(productsCategory);
  res.render("admin/pages/products/edit.pug", {
    product,
    categories: categoryTree,
  });
};
// Sửa sản phẩm Patch
module.exports.editPatch = async (req, res) => {
  // Chuyển đổi giá trị số và kiểm tra tính hợp lệ
  req.body.price = parseFloat(req.body.price);
  req.body.position = parseInt(req.body.position);

  // Kiểm tra nếu giá trị không hợp lệ thì trả về lỗi
  if (isNaN(req.body.price) || isNaN(req.body.position)) {
    req.flash("error", "Giá và vị trí phải là số hợp lệ.");
    return res.redirect("back");
  }

  const id = req.params.id;
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    const result = await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    if (result.nModified === 0) {
      req.flash("error", "Không có thay đổi nào được thực hiện.");
      return res.redirect("back");
    }
    req.flash("success", "Cập nhật thành công .");

    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật sản phẩm.");
    res.redirect("back");
  }
};
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  let find = {
    deleted: false,
    _id: id,
  };
  const product = await Product.findOne(find);
  const productsCategory = await ProductCategory.find({ deleted: false });
  const categoryTree = createTreeHelper.createTree(productsCategory);
  console.log(product);
  res.render("admin/pages/products/detail.pug", {
    product,
    categories: categoryTree,
  });
};
