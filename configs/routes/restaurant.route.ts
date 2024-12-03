import { RestActions } from "@configs/enum";
import { RestaurantController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class RestaurantRoute {
  private static path = Router();
  private static restaurantController = new RestaurantController();

  public static draw() {
    this.path.route("/:main_dish").get(this.restaurantController.index);
    // Đường dẫn vẫn giữ nguyên vì đây là tham số trong URL, không liên quan đến tên cột trong database.
    Route.resource(this.path, this.restaurantController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
