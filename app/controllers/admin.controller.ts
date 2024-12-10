import { Request, Response } from "express";
import { convertFileToBase64 } from "../../configs/fileUpload";
import models from "../models";
import { DishInstance } from "../models/dish"; // Import kiểu FeedbackInstance từ model
import { UserInstance } from "../models/user";
import { ApplicationController } from "./application.controller";

export class AdminController extends ApplicationController {
  public async index(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;
    try {
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng tới trang đăng nhập nếu không tìm thấy người dùng
      }

      // Render trang admin cùng với danh sách người dùng
      res.render("admin.view/admin_dashboard.view/dashboard", {
        User: user, // Truyền danh sách người dùng vào view
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi tải dữ liệu người dùng." });
      res.redirect("/error"); // Chuyển hướng đến trang lỗi
    }
  }

  public async admin_dashboardIndex(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
      // Hoặc có thể chuyển hướng tới trang login
    }

    const User = req.session.user;
    try {
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng tới trang đăng nhập nếu không tìm thấy người dùng
      }
      // Lấy số lượng tài khoản
      const totalAccounts = await models.User.count();
      // Lấy số lượng Admins (Giả sử role 1 là Admin)
      const totalAdmins = await models.User.count({
        where: { role: 1 },
      });

      // Lấy số lượng Users (Giả sử role 0 là User)
      const totalUsers = await models.User.count({
        where: { role: 0 },
      });

      // Lấy số lượng Món ăn chính (Giả sử bạn có một bảng 'Dishes' để lưu các món ăn)
      const totalMainDishes = await models.Dish.count();

      // Lấy số lượng Nhà hàng (Giả sử bạn có một bảng 'Restaurants' để lưu các nhà hàng)
      const totalRestaurants = await models.Restaurant.count();

      // Truyền tất cả thông tin vào view
      console.log("totalAccounts", totalAccounts);
      console.log("totalAdmins", totalAdmins);
      console.log("totalUsers", totalUsers);
      console.log("totalMainDishes", totalMainDishes);
      console.log("totalRestaurants", totalRestaurants);

      res.render("admin.view/admin_dashboard.view/dashboard", {
        totalAccounts,
        totalAdmins,
        totalUsers,
        totalMainDishes,
        totalRestaurants,
        User: user,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi tải dữ liệu thống kê." });
      res.redirect("/error"); // Chuyển hướng đến trang lỗi
    }
  }

  public async userManagementIndex(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
      // Hoặc có thể chuyển hướng tới trang login
    }

    const User = req.session.user;

    try {
      // Truy vấn thông tin người dùng từ database
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng tới trang đăng nhập nếu không tìm thấy người dùng
      }

      const Users = await models.User.findAll({
        attributes: ["id", "username", "email", "phone", "adress", "role"], // Chỉ lấy các cột cần thiết
        raw: true, // Trả về đối tượng thuần
      });

      // Truyền danh sách người dùng vào view
      res.render("admin.view/admin_dashboard.view/usermanagement", {
        Users,
        User: user,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi tải danh sách người dùng.",
      });
      res.redirect("/error");
    }
  }

  public async destroy(req: Request, res: Response) {
    try {
      const { user_id } = req.params;

      // Xóa người dùng
      await models.User.destroy({
        where: {
          id: user_id, // Sử dụng `id` thay vì `userId`
        },
      });
      req.flash("success", { msg: "Người dùng đã được xóa thành công." });
      res.redirect("/api/v1/admin/usermanagement");
    } catch (error) {
      console.error("Error deleting user:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi xóa người dùng." });
      res.redirect("/error");
    }
  }

  public async createUserIndex(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;

    try {
      // Truy vấn thông tin người dùng từ database
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng tới trang đăng nhập nếu không tìm thấy người dùng
      }

      // Truyền danh sách người dùng vào view
      res.render("admin.view/admin_dashboard.view/adduser", { User: user });
    } catch (error) {
      console.error("Error fetching users:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi tải danh sách người dùng.",
      });
      res.redirect("/error");
    }
  }

  public async createUser(req: Request, res: Response) {
    const { username, email, address, phone, role, confirmPassword, password } =
      req.body;
    const file = req.file ? convertFileToBase64(req.file) : null;
    console.log("File received:", req.body.file); // Kiểm tra file nhận được
    // console.log("File converted:", file); // Kiểm tra file sau khi convert

    console.log(req.body); // Kiểm tra dữ liệu từ form
    console.log("password", confirmPassword, password);
    if (confirmPassword !== password) {
      req.flash("errors", { msg: "Confirm password does not match." });
      return res.redirect("/api/v1/admin/createuser");
    }

    try {
      const users = (await models.User.create({
        username: username,
        email: email,
        avatar: file,
        role: role,
        password: password,
        adress: address,
        phone: phone,
      })) as UserInstance;

      req.flash("success", { msg: `Created user ${users.username}` });
      res.redirect("/api/v1/admin/usermanagement");
    } catch (error) {
      // Lỗi khi tạo user
      console.error("Error creating user:", error); // Thêm câu lệnh để kiểm tra lỗi chi tiết
      req.flash("errors", {
        msg: "An error occurred while creating the user.",
      });
      res.redirect("/api/v1/admin/usermanagement");
    }
  }

  public async restaurantAdminIndex(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;

    try {
      // Truy vấn thông tin người dùng từ database
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng tới trang đăng nhập nếu không tìm thấy người dùng
      }

      // Lấy danh sách tất cả người dùng
      const Restaurants = await models.Restaurant.findAll({});

      // Truyền danh sách nhà hàng vào view
      res.render("admin.view/admin_dashboard.view/restaurant", {
        Restaurants,
        User: user,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi tải danh sách người dùng.",
      });
      res.redirect("/error");
    }
  }
  public async restaurantAdminDestroy(req: Request, res: Response) {
    try {
      const { restaurant_id } = req.params;

      // Xóa người dùng
      await models.Restaurant.destroy({
        where: {
          id: restaurant_id, // Sử dụng `id` thay vì `userId`
        },
      });
      req.flash("success", { msg: "Nhà hàng đã được xóa thành công." });
      res.redirect("/api/v1/admin/restaurants");
    } catch (error) {
      console.error("Error deleting user:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi xóa Nhà hàng." });
      res.redirect("/error");
    }
  }
  public async detailRestaurantIndex(req: Request, res: Response) {
    // Nếu cần kiểm tra session của người dùng, bạn có thể mở lại phần này
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const Users = req.session.user;
    const { restaurant_id, user_id } = req.params;
    try {
      // Lấy danh sách món ăn của nhà hàng từ database

      const user = (await models.User.findOne({
        where: {
          id: Users.id,
        },
      })) as UserInstance;

      const city = await models.City.findOne();
      if (!user) {
        console.log("User not found in database");
        return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
      }

      const dishes = await models.Dish.findAll({
        where: { restaurant_id },
      });

      console.log("dissh:", dishes);

      const User1 = await models.User.findOne({
        where: { id: user_id },
      });
      console.log("User:", User1);
      // Lấy thông tin nhà hàng từ database
      const UserRestaurants = await models.Restaurant.findOne({
        where: { id: restaurant_id },
      });

      console.log("UserRestaurants:", UserRestaurants);
      // Kiểm tra nếu không tìm thấy nhà hàng
      if (!UserRestaurants) {
        console.log("Restaurant not found");
        return res.redirect("/error"); // Nếu không tìm thấy nhà hàng, chuyển hướng tới trang lỗi
      }

      // Truyền dữ liệu nhà hàng và món ăn vào view
      res.render("admin.view/admin_dashboard.view/details_restaurant", {
        dish: dishes,
        UserRestaurants,
        User1,
        User: user,
      });
    } catch (error) {
      console.error("Error fetching restaurant details:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi tải thông tin nhà hàng.",
      });
      res.redirect("/error"); // Chuyển hướng tới trang lỗi khi có lỗi xảy ra
    }
  }

  public async detailRestaurant(req: Request, res: Response) {
    const { restaurant_id, user_id } = req.params;

    try {
      // Cập nhật trạng thái "approved" thành true trong database
      const updatedRestaurant = await models.Restaurant.update(
        { approved: 1 }, // Cập nhật trường approved
        { where: { id: restaurant_id } } // Điều kiện cập nhật
      );

      if (updatedRestaurant[0] > 0) {
        // Nếu cập nhật thành công
        req.flash("success", { msg: "Nhà hàng đã được phê duyệt thành công." });
      } else {
        // Nếu không tìm thấy nhà hàng
        req.flash("errors", { msg: "Không tìm thấy nhà hàng để phê duyệt." });
      }

      // Chuyển hướng về chi tiết nhà hàng sau khi cập nhật
      res.redirect(
        `/api/v1/admin/restaurants/detail/${restaurant_id}/${user_id}`
      );
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi cập nhật trạng thái nhà hàng.",
      });
      res.redirect("/error"); // Chuyển hướng tới trang lỗi
    }
  }

  public async dishManagementIndex(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const Users = req.session.user;
    try {
      // Truy vấn thông tin người dùng từ database

      const user = (await models.User.findOne({
        where: {
          id: Users.id,
        },
      })) as UserInstance;

      // Lấy danh sách món ăn và thông tin thành phố
      const Dishes = (await models.Dish.findAll({
        where: { main_dish: 1 }, // Điều kiện lọc
        attributes: ["id", "name", "description", "city_id", "img"], // Lấy những thuộc tính cần thiết
      })) as DishInstance[];

      // Lấy danh sách city_id để truy vấn thành phố sau
      const cityIds = Dishes.map((dish) => dish.city_id);

      // Lấy thông tin của các thành phố từ bảng City
      const cities = await models.City.findAll({
        where: {
          id: cityIds, // Sử dụng mảng cityIds để tìm các thành phố theo city_id
        },
        attributes: ["id", "city_name"],
      });

      // Tạo bản đồ city_id -> city_name để tra cứu nhanh
      const cityMap = cities.reduce<{ [key: number]: string }>((acc, city) => {
        // Ép kiểu rõ ràng cho city
        const typedCity = city as { id: number; city_name: string }; // Ép kiểu city về đúng kiểu mong muốn
        acc[typedCity.id] = typedCity.city_name; // Gán city_name vào map
        return acc;
      }, {});

      // Map lại dữ liệu Dishes với tên thành phố
      const formattedDishes = Dishes.map((dish) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        city_name: cityMap[dish.city_id as number] || "Không xác định", // Ép kiểu city_id về kiểu number
        img: dish.img,
      }));

      console.log("formattedDishes", formattedDishes);

      // Render giao diện và truyền dữ liệu
      res.render("admin.view/admin_dashboard.view/dishmanagement", {
        Dishes: formattedDishes,
        User: user,
      });
    } catch (error) {
      console.error("Error fetching dishes:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi tải danh sách món ăn.",
      });
      res.redirect("/error"); // Chuyển hướng tới trang lỗi
    }
  }

  public async dishManagementDestroy(req: Request, res: Response) {
    try {
      const { dish_id } = req.params;

      // Xóa người dùng
      await models.Dish.destroy({
        where: {
          id: dish_id, // Sử dụng `id` thay vì `userId`
        },
      });
      req.flash("success", { msg: "món ăn đã được xóa thành công." });
      res.redirect("/api/v1/admin/dish_main");
    } catch (error) {
      console.error("Error deleting user:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi xóa món ăn." });
      res.redirect("/error");
    }
  }

  public async createDishIndex(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;

    try {
      // Truy vấn thông tin món ăn từ database
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng tới trang đăng nhập nếu không tìm thấy món ăn
      }
      const City = await models.City.findAll();
      // Truyền danh sách món ăn vào view
      res.render("admin.view/admin_dashboard.view/add_dish", {
        City,
        User: user,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      req.flash("errors", {
        msg: "Đã xảy ra lỗi khi tải danh sách món ăn.",
      });
      res.redirect("/error");
    }
  }

  public async createDish(req: Request, res: Response) {
    // Lấy dữ liệu từ req.body
    const { name, description, city_id } = req.body;
    const file = req.file ? convertFileToBase64(req.file) : null;

    console.log("Dish data received:", req.body.file); // Kiểm tra dữ liệu món ăn từ form

    // Kiểm tra dữ liệu món ăn, nếu thiếu thông tin cần thiết thì trả về lỗi
    if (!name || !description || !city_id) {
      req.flash("errors", { msg: "All fields are required." });
      return res.redirect("/api/v1/admin/dish_main/createdish"); // Điều hướng lại form tạo món ăn
    }

    try {
      // Tạo mới món ăn trong cơ sở dữ liệu
      const dish = (await models.Dish.create({
        name: name,
        description: description,
        price: null,
        restaurant_id: null,
        city_id: city_id,
        main_dish: 1,
        user_id: null,
        img: file, // Lưu ảnh món ăn nếu có
      })) as DishInstance;

      // Nếu món ăn được tạo thành công, gửi thông báo và chuyển hướng
      req.flash("success", { msg: `Created dish ${dish.name}` });
      res.redirect("api/v1/admin/dish_main"); // Điều hướng đến trang quản lý món ăn
    } catch (error) {
      // Xử lý lỗi nếu có trong quá trình tạo món ăn
      console.error("Error creating dish:", error); // Thêm câu lệnh để kiểm tra lỗi chi tiết
      req.flash("errors", {
        msg: "An error occurred while creating the dish.",
      });
      res.redirect("/api/v1/admin/dish_main/createdish"); // Điều hướng lại form nếu có lỗi
    }
  }
}
