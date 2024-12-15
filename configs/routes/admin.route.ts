import { RestActions } from "@configs/enum";
import { AdminController } from "@controllers";
import { Router } from "express";
import { Route } from ".";
import { upload } from "../fileUpload";

export class AdminRoute {
  private static path = Router();
  private static adminController = new AdminController();
  public static draw() {
    this.path.route("/").get(this.adminController.index);
    this.path
      .route("/dashboard")
      .get(this.adminController.admin_dashboardIndex);
    this.path
      .route("/usermanagement")
      .get(this.adminController.userManagementIndex);
    this.path
      .route("/usermanagement/:user_id")
      .delete(this.adminController.destroy);
    this.path
      .route("/createuser")
      .get(this.adminController.createUserIndex)
      .post(upload.single("avatar"), this.adminController.createUser);
    this.path
      .route("/restaurants")
      .get(this.adminController.restaurantAdminIndex);
    this.path
      .route("/restaurants/:restaurant_id")
      .delete(this.adminController.restaurantAdminDestroy);
    this.path
      .route("/restaurants/detail/:restaurant_id/:user_id")
      .get(this.adminController.detailRestaurantIndex)
      .post(this.adminController.detailRestaurant);

    this.path.route("/dish_main").get(this.adminController.dishManagementIndex);
    this.path
      .route("/dish_main/:dish_id")
      .delete(this.adminController.dishManagementDestroy);

    this.path
      .route("/dish_main/createdish")
      .get(this.adminController.createDishIndex)
      .post(upload.single("imgdish"), this.adminController.createDish);
    Route.resource(this.path, this.adminController, {
      only: [RestActions.Index, RestActions.Destroy],
    });

    return this.path;
  }
}
