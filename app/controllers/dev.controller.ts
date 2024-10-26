import { Request, Response } from "express";
import { ApplicationController } from ".";

export class DevController extends ApplicationController {
  public async index(req: Request, res: Response) {
    console.log(req.session);
    res.render("home.view/index", { title: "Irwin Framework" });
  }

  public async new(req: Request, res: Response) {
    res.render("dev.view/new");
  }

  public async update(req: Request, res: Response) {}

  public async destroy(req: Request, res: Response) {}
}
