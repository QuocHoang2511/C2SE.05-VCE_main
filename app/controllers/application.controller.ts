import models from "@models";
import { NextFunction, Request, Response } from "express";
import { Role, UserInstance } from "../models/user";

export class ApplicationController {
  public async validateUserLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: Delete this line
    const User = req.session.user;
    if (!User) {
      req.flash("errors", { msg: "You have to login first." });
      return res.redirect("/api/v1/auth/signin");
    }

    const user = (await models.User.findOne({
      where: {
        id: User.id,
      },
    })) as UserInstance;
    if (!user) {
      req.flash("errors", {
        msg: `User with id: ${User.id} does not found.`,
      });
      return res.redirect("/api/v1/auth/signin");
    }

    req.user = user;
    next();
  }

  public async validateAdmin(req: Request, res: Response, next: NextFunction) {
    const currentUser = req.user;

    if (currentUser.role === Role.ADMIN) {
      next();
    } else {
      req.flash("errors", {
        msg: `You are not an admin`,
      });

      return res.redirect("/api/v1/auth/signin");
    }
  }
}
