import { RestActions } from "@configs/enum";
import { RestaurantController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class RestaurantRoute {
  private static path = Router();
  private static restaurantController = new RestaurantController();

  public static draw() {
    this.path.route("/").get(this.restaurantController.index);
    Route.resource(this.path, this.restaurantController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
