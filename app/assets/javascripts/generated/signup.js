document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("form.signup-form")
    .addEventListener("submit", function (event) {
      const fullName = document.getElementById("fullName").value;
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const iamRole = document.getElementById("iam_role").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (fullName.length < 3 || fullName.length > 25) {
        alert("Full Name must be between 3 and 25 characters.");
        event.preventDefault();
        return;
      }

      if (username.length < 3 || username.length > 12) {
        alert("Username must be between 3 and 12 characters.");
        event.preventDefault();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Invalid email format.");
        event.preventDefault();
        return;
      }

      if (["admin", "operator", "member"].indexOf(iamRole) === -1) {
        alert("Invalid role selected.");
        event.preventDefault();
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        event.preventDefault();
        return;
      }

      // Perform password hashing here before submission (e.g., using bcrypt.js)
    });
});
