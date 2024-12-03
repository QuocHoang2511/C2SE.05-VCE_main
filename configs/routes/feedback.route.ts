import { RestActions } from "@configs/enum";
import { FeedbackController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class FeedbackRoute {
  private static path = Router();
  private static feedbackController = new FeedbackController();
  public static draw() {
    this.path
      .route("/:restaurant_id")
      .get(this.feedbackController.index)
      .post(this.feedbackController.create);

    Route.resource(this.path, this.feedbackController, {
      only: [RestActions.Index],
    });

    return this.path;
  }
}
