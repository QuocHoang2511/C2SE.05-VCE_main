import { Request, Response } from "express";
import { random } from "lodash";
import { ApplicationController } from ".";
import models from "../models";
import { DishInstance } from "../models/dish";
import { UserInstance } from "../models/user";

export class HomeController extends ApplicationController {
  public async index(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
    try {
      // Truy vấn thông tin người dùng từ database

      // Truy vấn tất cả món ăn
      let a, b, c, d;

      // Kiểm tra sự trùng lặp và random lại nếu có trùng lặp
      do {
        a = random(1, 50);
        b = random(1, 50);
        c = random(1, 50);
        d = random(1, 50);
      } while (a === b || a === c || a === d || b === c || b === d || c === d);

      const dishes = (await models.Dish.findAll({
        where: {
          id: [a, b, c, d],
        },
      })) as DishInstance[];

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

      // Random 6 món ăn từ danh sách

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

      // Render trang home với thông tin người dùng và các món ăn ngẫu nhiên
      res.render("home.view/index", { User: user, dish: formattedDishes });
    } catch (error) {
      req.flash("errors", { msg: "Error fetching user:" });
      res.render("home.view/index");
    }
  }

  // Hàm để lấy các món ăn ngẫu nhiên từ danh sách
  private getRandomItems(array: any[], count: number): any[] {
    const shuffled = array.sort(() => 0.5 - Math.random()); // Xáo trộn mảng
    return shuffled.slice(0, count); // Lấy 6 món ăn ngẫu nhiên
  }
}
