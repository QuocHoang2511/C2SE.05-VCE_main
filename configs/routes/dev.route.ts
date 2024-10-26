import { RestActions } from "@configs/enum";
import { DevController } from "@controllers";
import { Router } from "express";
import { Route } from ".";

export class DevRoute {
  private static path = Router();
  private static devController = new DevController();

  public static draw() {
    Route.resource(this.path, this.devController, {
      except: [RestActions.Create],
    });

    return this.path;
  }
}
