const Cart = require("../../model/CartModel");
const Product = require("../../model/ProductModel");
const Order = require("../../model/OrderModel");
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
  res.render("client/page/checkout/index", {
    cartDetail: cart,
  });
};

// Post Order
module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  let products = [];
  for (let product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      quantity: product.quantity,
      discount: 0,
      price: 0,
    };
    const productInfo = await Product.findOne({
      _id: product.product_id,
    });
    objectProduct.price = productInfo.price;
    // objectProduct.discount = productInfo.discount;hiện sản phẩm chưa có thuộc tính discont lên demodemo

    products.push(objectProduct);
  }
  const objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(objectOrder);
  await order.save();
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );
  res.redirect(`/checkout/success/${order.id}`);
};

module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({
    _id: orderId,
  });
  for (let product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");
    product.productInfo = productInfo;
    product.priceNew =( product.price * ((100-20)/100));
    product.totalPrice = (product.priceNew) * (product.quantity);
  }
  order.totalPrice = order.products.reduce((sum, item)=>sum+item.totalPrice,0);
  res.render("client/page/checkout/success", {order});
};
