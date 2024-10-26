import { RestActions } from "@configs/enum";
import { AuthController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class AuthRoute {
  private static path = Router();
  private static authController = new AuthController();

  public static draw() {
    this.path.route("/google").get(this.authController.loginWithGoogle);
    this.path
      .route("/google/callback")
      .get(this.authController.loginWithGoogleRedirect);

    this.path
      .route("/signup")
      .get(this.authController.new)
      .post(this.authController.createUser);
    this.path
      .route("/signin")
      .get(this.authController.index, this.authController.create);
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
