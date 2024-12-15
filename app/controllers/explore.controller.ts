import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { DishInstance } from "../models/dish";
import { UserInstance } from "../models/user";

export class ExploreController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const { city_id } = req.query; // Lấy city_id từ query params
    console.log("City_query", city_id);

    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 3; // Số lượng món ăn hiển thị mỗi trang
      const offset = (page - 1) * limit;

      // Truy vấn theo city_id nếu có
      const { count, rows: dishes } = (await models.Dish.findAndCountAll({
        where: {
          main_dish: true,
          ...(city_id && { city_id: parseInt(city_id as string) }),
        },
        limit: limit,
        offset: offset,
      })) as { count: number; rows: DishInstance[] };

      // Lấy danh sách city_id từ các món ăn đã truy vấn
      const cityIds = dishes.map((dish) => dish.city_id);

      // Truy vấn thông tin các thành phố từ bảng City
      const cities = await models.City.findAll({
        where: {
          id: cityIds, // Tìm các thành phố theo city_id
        },
        attributes: ["id", "city_name"],
      });

      // Tạo bản đồ city_id -> city_name để tra cứu nhanh
      const cityMap = cities.reduce<{ [key: number]: string }>((acc, city) => {
        const typedCity = city as { id: number; city_name: string }; // Ép kiểu city
        acc[typedCity.id] = typedCity.city_name; // Gán city_name vào bản đồ
        return acc;
      }, {});

      // Map lại dữ liệu Dishes với tên thành phố
      const formattedDishes = dishes.map((dish) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        city_name: cityMap[dish.city_id as number] || "Không xác định", // Tra cứu tên thành phố từ cityMap
        img: dish.img,
      }));

      console.log("formattedDishes", formattedDishes);

      // Lấy thông tin tất cả các thành phố để gửi đến view
      const cityData = await models.City.findAll();
      console.log("Total count of dishes:", count);

      // Kiểm tra thông tin người dùng từ session
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

      // Render trang explore với thông tin món ăn và thành phố
      res.render("explore.view/index", {
        User: user,
        dishes: formattedDishes, // Gửi danh sách món ăn đã được định dạng
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
