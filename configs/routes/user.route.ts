import { RestActions } from "@configs/enum";
import { UserController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class UserRoute {
  private static path = Router();
  private static userController = new UserController();

  public static draw() {
    // Route cho trang profile
    this.path.route("/profile").get(this.userController.index);

    // Route cho trang edit profile
    this.path
      .route("/editprofile")
      .get(this.userController.editProfileindex)
      .post(this.userController.editProfile);
    this.path
      .route("/changepassword")
      .get(this.userController.changepasswordindex)
      .post(this.userController.changepassword);

    Route.resource(this.path, this.userController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
