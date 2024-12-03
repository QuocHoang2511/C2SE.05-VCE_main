import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { UserInstance } from "../models/user";

export class RestaurantController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const { main_dish } = req.params; // Lấy restaurant_id từ params

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 4; // Số lượng nhà hàng hiển thị mỗi trang
      const offset = (page - 1) * limit;

      // Truy vấn danh sách nhà hàng
      const { count, rows: restaurants } =
        await models.Restaurant.findAndCountAll({
          where: {
            approved: 1,
            ...(main_dish && { main_dishes: parseInt(main_dish as string) }),
          }, // Đổi từ main_dish thành main_dishes
          limit: limit,
          offset: offset,
        });

      console.log("Total count of restaurants: ", count);
      console.log("Restaurants data: ", restaurants);

      // Nếu người dùng đã đăng nhập, lấy thông tin user
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

      // Render trang nhà hàng (có hoặc không có thông tin người dùng)
      res.render("restaurant.view/index", {
        User: user, // Nếu không đăng nhập, giá trị sẽ là null
        restaurant: restaurants,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.error("Error fetching restaurants or user:", error);
      req.flash("errors", {
        msg: "An error occurred while loading restaurants.",
      });
      res.redirect("/error"); // Chuyển hướng đến trang lỗi (nếu có)
    }
  }
}
