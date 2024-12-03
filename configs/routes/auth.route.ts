import { RestActions } from "@configs/enum";
import { AuthController } from "@controllers";
import { Router } from "express";
import { Route } from ".";
import { upload } from "../fileUpload";

export class AuthRoute {
  private static path = Router();
  private static authController = new AuthController();

  public static draw() {
    this.path.route("/google").get(this.authController.loginWithGoogle);
    this.path
      .route("/google/callback")
      .get(this.authController.loginWithGoogleRedirect);
    this.path.route("/logout").delete(this.authController.destroy);

    this.path;
    this.path
      .route("/signup")
      .get(this.authController.new)
      .post(upload.single("avatar"), this.authController.createUser);

    this.path
      .route("/signin")
      .get(
        this.authController.index,
        this.authController.validateUserLogin,
        this.authController.validateAdmin,
        this.authController.create
      );
    this.path
      .route("/forgotpassword")
      .get(this.authController.forgotPasswordUserIndex) // Hiển thị form quên mật khẩu
      .post(this.authController.forgotPasswordUser); // Xử lý gửi form quên mật khẩu
    this.path
      .route("/setpassword/:email")
      .get(this.authController.setPasswordUserIndex)
      .post(this.authController.setPasswordUser); // Đảm bảo định nghĩa chính xác
    Route.resource(this.path, this.authController, {
      only: [
        RestActions.Destroy,
        RestActions.Index,
        RestActions.Create,
        RestActions.New,
      ],
    });

    return this.path;
  }
}
