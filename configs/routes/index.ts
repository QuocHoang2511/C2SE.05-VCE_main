import env from "@configs/env";
import { HomeController } from "@controllers";
import { Router } from "express";
import { RestActions } from "../enum";
import { AdminRoute } from "./admin.route";
import { AuthRoute } from "./auth.route";
import { ContactRoute } from "./contact.route";
import { DevRoute } from "./dev.route";
import { ExploreRoute } from "./explore.route";
import { FeedbackRoute } from "./feedback.route";
import { RestaurantRoute } from "./restaurant.route";
import { UserRoute } from "./user.route";
export class Route {
  private static path = Router();
  private static homeController = new HomeController();

  public static draw() {
    if (env.nodeEnv === "development") this.path.use("/dev", DevRoute.draw());

    this.path.use("/api/v1/auth", AuthRoute.draw());
    this.path.use("/api/v1/user", UserRoute.draw());
    this.path.use("/api/v1/explore", ExploreRoute.draw());
    this.path.use("/api/v1/restaurant", RestaurantRoute.draw());
    this.path.use("/api/v1/contact", ContactRoute.draw());
    this.path.use("/api/v1/feedback", FeedbackRoute.draw());
    this.path.use("/api/v1/admin", AdminRoute.draw());

    Route.resource(this.path, this.homeController, {
      only: [RestActions.Index],
    });

    return this.path;
  }

  public static resource(
    path: Router,
    customController: any,
    filter?: {
      only?: RestActions[];
      except?: RestActions[];
    }
  ) {
    if (filter?.only && filter?.except) {
      throw new Error("Can only pass only or except!");
    }

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Index))
      path.route("/").get(customController.index);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.New))
      path.route("/new").get(customController.new);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Show))
      path.route("/:id").get(customController.show);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Create))
      path.route("/").post(customController.create);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Edit))
      path.route("/:id/edit").get(customController.edit);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Update))
      path.route("/:id").put(customController.update);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Destroy))
      path.route("/:id").delete(customController.destroy);
  }

  private static isAllowAccess(
    only: RestActions[] | undefined,
    except: RestActions[] | undefined,
    action: RestActions
  ) {
    return (
      (!only && !except) ||
      (only && only?.includes(action)) ||
      (except && !except?.includes(action))
    );
  }
}
