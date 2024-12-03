import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { UserInstance } from "../models/user";

export class ExploreController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const { city_id } = req.query; // Lấy city_id từ query params thay vì req.body
    console.log("City_query", city_id);

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 3; // Số lượng món ăn hiển thị mỗi trang
      const offset = (page - 1) * limit;

      // Truy vấn theo city_id nếu có
      const { count, rows: dishes } = await models.Dish.findAndCountAll({
        where: {
          main_dish: 1,
          ...(city_id && { city_id: parseInt(city_id as string) }),
        },
        limit: limit,
        offset: offset,
      });

      const cityData = await models.City.findAll();
      console.log("Total count of dishes: ", count);
      let user = null;
      if (req.session?.user) {
        user = (await models.User.findOne({
          where: { id: req.session.user.id },
        })) as UserInstance;

        if (!user) {
          console.log("User not found in database");
          req.flash("errors", { msg: "User not found." });
          return res.redirect("/login");
        }
      }
      // Render trang explore
      res.render("explore.view/index", {
        User: user,
        dishes: dishes, // Danh sách món ăn
        City: cityData,
        currentPage: page, // Trang hiện tại
        totalPages: Math.ceil(count / limit), // Tổng số trang
      });
    } catch (error) {
      console.error("Error fetching dishes or user:", error);
      req.flash("errors", { msg: "An error occurred while loading dishes." });
      return res.redirect("/"); // Chuyển hướng đến trang lỗi (nếu có)
    }
  }
}
