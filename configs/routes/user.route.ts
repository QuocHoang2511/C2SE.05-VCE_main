import { RestActions } from "@configs/enum";
import { UserController } from "@controllers";
import { Router } from "express";
import { Route } from ".";
import { upload } from "../fileUpload";

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

    this.path.route("/favorite").get(this.userController.Favoriteindex);
    this.path
      .route("/registering")
      .get(this.userController.registeringindex)
      .post(upload.single("Restaurant"), this.userController.registering);
    // Định nghĩa route chính xác cho dish_menu
    this.path
      .route("/dish_menu/:restaurant_id")
      .get(this.userController.dish_menuindex)
      .post(upload.single("Dish"), this.userController.dish_menu);

    // .post(upload.single("Restaurant"), this.userController.createUser);
    Route.resource(this.path, this.userController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
