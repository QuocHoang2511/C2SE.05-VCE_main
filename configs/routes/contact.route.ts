import { RestActions } from "@configs/enum";
import { ContactController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class ContactRoute {
  private static path = Router();
  private static contactController = new ContactController();

  public static draw() {
    this.path.route("/").get(this.contactController.index);
    Route.resource(this.path, this.contactController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
