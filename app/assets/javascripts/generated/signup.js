document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("form.signup-form")
    .addEventListener("submit", function (event) {
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const address = document.getElementById("address").value;
      const phone = document.getElementById("phone").value;

      // Kiểm tra điều kiện cho các biến
      if (username.length < 3 || username.length > 12) {
        alert("Username phải có độ dài từ 3 đến 12 ký tự.");
        event.preventDefault();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Email không đúng định dạng.");
        event.preventDefault();
        return;
      }

      if (password.length < 6) {
        alert("Password phải có ít nhất 6 ký tự.");
        event.preventDefault();
        return;
      }

      if (address.length === 0) {
        alert("Vui lòng nhập địa chỉ.");
        event.preventDefault();
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        alert("Số điện thoại phải là 10 chữ số.");
        event.preventDefault();
        return;
      }
    });
});
