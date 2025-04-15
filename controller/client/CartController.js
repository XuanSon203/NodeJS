const Cart = require("../../model/CartModel");
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cart = await Cart.findOne({
    _id: cartId,
  });
  // tìm kiếm sản phẩm và kiểm tra xem sản phẩm đã có chưa nếu có thì update quantity còn không thì sẽ thêm vào objectCart
  const exitsProductCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (exitsProductCart) {
    const newQuantity = quantity + exitsProductCart.quantity;
    await Cart.updateOne({
      _id:cartId,
     'products.product_id':productId,
    },{
      'products.$.quantity':newQuantity,
    })
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
