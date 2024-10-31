import { Request, Response } from "express";
import { ApplicationController } from ".";

export class HomeController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const currentPage = req.body.currentPage;

    res.render("home.view/index", { User: req.session.user });
  }
}
