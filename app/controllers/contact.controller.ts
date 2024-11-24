import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { UserInstance } from "../models/user";

export class ContactController extends ApplicationController {
  public async index(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      res.render("contact.view/index"); // Hoặc có thể chuyển hướng tới trang login
    }

    const User = req.session.user;

    try {
      // Truy vấn thông tin người dùng từ database

      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;
      const city = await models.City.findOne();
      if (!user) {
        console.log("User not found in database");
        res.render("contact.view/index");
      }

      // Render trang home với thông tin người dùng
      res.render("contact.view/index", { User: user });
    } catch (error) {
      req.flash("errors", { msg: "Error fetching user:" });
    }
  }
}
