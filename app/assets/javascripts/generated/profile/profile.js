document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll("nav.menu ul li a");

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Xóa lớp "active" khỏi tất cả các mục
      menuItems.forEach((i) => i.classList.remove("active"));
      // Thêm lớp "active" vào mục hiện tại
      this.classList.add("active");
    });
  });
});
