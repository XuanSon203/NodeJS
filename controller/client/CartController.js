const Cart = require("../../model/CartModel");
const Product = require("../../model/ProductModel");
// GET
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  if (cart.products.length > 0) {
    for (let item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });
      productInfo.priceNew = productInfo.price * (100 - 20); // Gía mới = giá cũ -(1-discount)
      item.productInfo = productInfo;
      item.totalPrice = cart.products.reduce(
        (sum, item) => sum + item.quantity * productInfo.priceNew,
        0
      );
    }
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }
  res.render("client/page/cart/index", {
    cart,
  });
};

module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cart = await Cart.findOne({
    _id: cartId,
  });
  // Tìm kiếm sản phẩm và kiểm tra xem sản phẩm đã có chưa nếu có thì update quantity còn không thì sẽ thêm vào objectCart
  const exitsProductCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (exitsProductCart) {
    const newQuantity = quantity + exitsProductCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    const cart = await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }
  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
  res.redirect("back");
};
// Delete Item in Cart
module.exports.deleteItem = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: {
        products: {
          product_id: productId,
        },
      },
    }
  );
  req.flash("success", "Sản phẩm đã được xóa khỏi giỏ hàng ");
  res.redirect("back");
};

// Update Quantity in Cart
module.exports.updateQuantity = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  const cartId = req.cookies.cartId;
  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );
  res.redirect("back");
};
