const formSearch = document.querySelector(".form-search");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    let url = new URL(window.location.href);
    e.preventDefault();
    const search = e.target[0].value;
    if (search) {
      url.searchParams.set("search", search);
    } else {
      url.searchParams.delete("search");
    }
    window.location.href = url.href;
  });
}
//  Làm phân trang PaginationPagination
const btnPagnation = document.querySelectorAll("[button-pagination]");
if (btnPagnation) {
  btnPagnation.forEach((btn) => {
    let url = new URL(window.location.href);
    btn.addEventListener("click", (e) => {
      const page = btn.getAttribute("button-pagination");

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const checkAll = checkboxMulti.querySelector("#check-all");
  const checkboxItem = checkboxMulti.querySelectorAll(".checkbox-item");

  checkAll.addEventListener("click", () => {
    if (checkAll.checked) {
      checkboxItem.forEach((item) => {
        item.checked = true;
      });
    } else {
      checkboxItem.forEach((item) => {
        item.checked = false;
      });
    }
  });
  checkboxItem.forEach((item) => {
    item.addEventListener("click", () => {
      // Đếm số lượng checkbox được chọn bên trong phần tử chứa chúng
      const countChecked = checkboxMulti.querySelectorAll(
        ".checkbox-item:checked"
      ).length;
      if (countChecked === checkboxItem.length) {
        checkAll.checked = true;
      } else {
        checkAll.checked = false;
      }
    });
  });
}
// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkedItem = checkboxMulti.querySelectorAll(
      ".checkbox-item:checked"
    );
    const inputStatus = checkboxMulti.querySelector("#status-value");
    const typeChange = e.target.elements.type.value;
    if (typeChange == "deleteAll") {
      const isConfirm = confirm("Bạn có muốn xóa tất cả sản phẩm không ?");
      if (!isConfirm) {
        return;
      }
    }

    if (checkedItem.length > 0) {
      let ids = [];
      const inputValues = formChangeMulti.querySelector("#input-values");
      checkedItem.forEach((item) => {
        const id = item.value;
        if (typeChange == "change-position") {
          const position = item
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id} - ${position}`);
        } else {
          ids.push(id);
        }
      });
      inputValues.value = ids.join(",");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi !");
    }
  });
}

//Xử logic cho thông báo
const showAlert = document.querySelector("#show-alert");
const closeAlert = document.querySelector("#close-alert");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  console.log(time);
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.style.display = "none";
  });
}
//  PreviewImage Upload
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const btnRemoveImage = document.querySelector("[upload-image-remove]");
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const [file] = e.target.files;
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      btnRemoveImage.addEventListener("click", (e) => {
        uploadImageInput.value = "";
        uploadImagePreview.src = "";
      });
    }
  });
}
