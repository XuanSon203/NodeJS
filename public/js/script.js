//Xử logic cho thông báo
const showAlert = document.querySelector("#show-alert");
const closeAlert = document.querySelector("#close-alert");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.style.display = "none";
  });
}
// Code thay đổi số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product_id");

      console.log(productId);
      const quantity = parseInt(e.target.value);
      if (quantity => 1) {
        location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}
