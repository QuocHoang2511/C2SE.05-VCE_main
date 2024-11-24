import { RestActions } from "@configs/enum";
import { ExploreController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class ExploreRoute {
  private static path = Router();
  private static exploreController = new ExploreController();

  public static draw() {
    this.path.route("/").get(this.exploreController.index);
    Route.resource(this.path, this.exploreController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
