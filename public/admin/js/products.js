const btnChangeStatus = document.querySelectorAll("[btn-change-status]");

if (btnChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  btnChangeStatus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const statusCurrent = btn.getAttribute("data-status");

      const id = btn.getAttribute("data-id");
      let statusChange = statusCurrent == "Active" ? "Inactive" : "Active";
      const action = path + "/" + statusChange + "/" + id + "?_method=PATCH";
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}

//  Button Delete product
const btnDelete = document.querySelectorAll("[button-delete]");
if (btnDelete.length > 0) {
  const formDelete = document.querySelector("#form-delete-item-products");
  const path = formDelete.getAttribute("data-path");
  btnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      let isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không ? ");
      if (isConfirm) {
        const id = btn.getAttribute("data-id");
        const action = `${path}/${id}?_method=Delete`;
        formDelete.action =action;
        formDelete.submit();
      }
    });
  });
}
