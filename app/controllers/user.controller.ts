import { Request, Response } from "express";
import { ApplicationController } from ".";
import { convertFileToBase64 } from "../../configs/fileUpload";
import models from "../models";
import { UserInstance } from "../models/user";

export class UserController extends ApplicationController {
  // Render trang profile.pug
  public async index(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      res.redirect("/"); // Hoặc có thể chuyển hướng tới trang login
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
        res.render("user.view/profile");
      }

      // Render trang home với thông tin người dùng
      res.render("user.view/profile.view/editprofile", {
        User: user,
      });
    } catch (error) {
      req.flash("errors", { msg: "Error fetching user:" });
    }
  }

  // Render trang editprofile.pug
  public async editProfileindex(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
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

      // Render trang edit profile với thông tin người dùng
      res.render("user.view/profile.view/editprofile", {
        User: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      req.flash("errors", { msg: "Error fetching user:" });
    }
  }

  public async editProfile(req: Request, res: Response) {
    const { username, address, email, phone } = req.body;
    const userId = req.session.user?.id; // Lấy ID từ session
    console.log("userID của section: ", userId);

    if (!userId) {
      console.log("Không tìm thấy người dùng trong session");
      req.flash("errors", { msg: "Phiên làm việc không hợp lệ." });
      return res.redirect("/api/v1/user/profile");
    }

    try {
      const user = (await models.User.findOne({
        where: { id: userId },
      })) as UserInstance;

      if (!user) {
        console.log(`Không tìm thấy người dùng với id: ${userId}`);
        req.flash("errors", { msg: "Người dùng không tồn tại." });
        return res.redirect("/api/v1/user/profile");
      }

      // Cập nhật thông tin người dùng
      await models.User.update(
        { username, adress: address, email, phone },
        { where: { id: userId } } // Thêm điều kiện where
      );

      req.flash("success", { msg: "Cập nhật thông tin thành công." });
      res.redirect("/api/v1/user/editprofile");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi cập nhật thông tin." });
      res.redirect("/api/v1/user/editprofile");
    }
  }

  public async changepassword(req: Request, res: Response) {
    const { current_password, new_password, confirm_password } = req.body;
    const userId = req.session.user?.id; // Lấy ID từ session
    console.log("userID của section: ", userId);

    if (!userId) {
      console.log("Không tìm thấy người dùng trong session");
      req.flash("errors", { msg: "Phiên làm việc không hợp lệ." });
      return res.redirect("/api/v1/user/profile");
    }

    try {
      const user = (await models.User.findOne({
        where: { id: userId },
      })) as UserInstance;

      if (!user) {
        console.log(`Không tìm thấy người dùng với id: ${userId}`);
        req.flash("errors", { msg: "Người dùng không tồn tại." });
        return res.redirect("/api/v1/user/profile");
      }
      if (user.password !== current_password) {
        req.flash("errors", { msg: "Mật khẩu hiện tại không đúng." });
        res.redirect("/api/v1/user/changepassword");
      } else {
        if (new_password !== confirm_password) {
          req.flash("errors", { msg: "Xác nhận mật khẩu không đúng." });
          res.redirect("/api/v1/user/changepassword");
        } else {
          // Cập nhật thông tin người dùng
          await models.User.update(
            {
              password: new_password,
            },
            { where: { id: userId } }
          );
          req.flash("success", { msg: "Cập nhật thông tin thành công." });
          res.redirect("/api/v1/user/changepassword");
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      req.flash("errors", { msg: "Đã xảy ra lỗi khi cập nhật thông tin." });
      res.redirect("/api/v1/user/editprofile");
    }
  }

  public async changepasswordindex(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;

    try {
      // Truy vấn thông tin người dùng từ database để đảm bảo user tồn tại
      const user = await models.User.findOne({
        where: { id: User.id },
      });

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng nếu không tìm thấy người dùng
      }

      // Render trang đổi mật khẩu với thông tin người dùng
      res.render("user.view/profile.view/changepassword", {
        User: user,
      });
    } catch (error) {
      console.error("Error rendering change password page:", error);
      req.flash("errors", { msg: "Error fetching user:" });
    }
  }

  public async Favoriteindex(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 3; // Số lượng nhà hàng hiển thị mỗi trang
    const offset = (page - 1) * limit;

    try {
      // Truy vấn thông tin người dùng từ database để đảm bảo user tồn tại
      const user = (await models.User.findOne({
        where: {
          id: User.id,
        },
      })) as UserInstance;

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng nếu không tìm thấy người dùng
      }

      // Truy vấn danh sách nhà hàng với phân trang
      const { count, rows: restaurants } =
        await models.Restaurant.findAndCountAll({
          where: { user_id: User.id, favourite: true },
          limit: limit,
          offset: offset,
        });
      console.log("Total count of restaurants: ", User.id);
      console.log("Total count of restaurants: ", count);
      console.log("Restaurants data: ", restaurants);

      // Render trang yêu thích với thông tin người dùng và danh sách nhà hàng
      res.render("user.view/profile.view/favorite", {
        User: user,
        restaurant: restaurants,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (error) {
      console.error("Error fetching favorite restaurants:", error);
      req.flash("errors", { msg: "Error fetching user or restaurants" });
      res.redirect("/error");
    }
  }

  public async registeringindex(req: Request, res: Response) {
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;

    try {
      const user = await models.User.findOne({
        where: { id: User.id },
      });
      const city = await models.City.findAll();

      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng nếu không tìm thấy người dùng
      }

      // Lấy danh sách nhà hàng của user
      const userRestaurants = await models.Restaurant.findAll({
        where: { user_id: User.id, approved: true },
      });
      const main_dish = await models.Dish.findAll({
        where: { main_dish: true },
      });

      // Render trang
      res.render("user.view/profile.view/registering", {
        User: user,
        City: city,
        UserRestaurants: userRestaurants,
        Main_dish: main_dish,
      });
    } catch (error) {
      console.error("Error rendering registering page:", error);
      req.flash("errors", { msg: "Error fetching user data." });
    }
  }

  public async registering(req: Request, res: Response) {
    const {
      restaurant_name,
      address,
      phone_number,
      main_dishes,
      city_id,
      description,
    } = req.body;

    // Kiểm tra session và người dùng
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng về trang chính nếu không có session
    }

    const User = req.session.user;

    try {
      // if (type === "dish") {
      //   return res.redirect(`/api/v1/user/dish_menu/${restaurant_id}`); // Chuyển hướng đến trang đăng nhập (nếu cần)
      // }
      // Xử lý file upload (nếu có)
      const file = req.file ? convertFileToBase64(req.file) : null;
      console.log("User role:", User.role); // Kiểm tra file nhận được

      // Tạo mới nhà hàng
      if (User.role == 1) {
        await models.Restaurant.create({
          restaurant_name,
          address,
          phone_number,
          main_dishes,
          city_id,
          img_restaurant: file, // Lưu file dưới dạng Base64
          description,
          approved: true, // Mặc định là được duyệt
          user_id: User.id, // Liên kết nhà hàng với người dùng
          favourite: true,
        });
      } else {
        await models.Restaurant.create({
          restaurant_name,
          address,
          phone_number,
          main_dishes,
          city_id,
          img_restaurant: file, // Lưu file dưới dạng Base64
          description,
          approved: false, // Mặc định là được duyệt
          user_id: User.id, // Liên kết nhà hàng với người dùng
          favourite: true,
        });
      }
      // Hiển thị thông báo thành công
      req.flash("success", { msg: `Created restaurant successfully!` });
      return res.redirect("/api/v1/user/registering"); // Chuyển hướng đến trang đăng nhập (nếu cần)
    } catch (error) {
      console.error("Error creating restaurant:", error); // In chi tiết lỗi
      req.flash("errors", {
        msg: "An error occurred while creating the restaurant.",
      });
      return res.redirect("/"); // Chuyển hướng về trang chính
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

  public async dish_menuindex(req: Request, res: Response) {
    // Kiểm tra nếu session không tồn tại hoặc không có user
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng tới trang đăng nhập nếu không có user trong session
    }

    const User = req.session.user;
    const { restaurant_id } = req.params; // Lấy restaurant_id từ params
    console.log("Restaurant ID from params 1:", restaurant_id); // Kiểm tra giá trị restaurant_id
    try {
      // Truy vấn thông tin người dùng từ database để đảm bảo user tồn tại
      const user = await models.User.findOne({
        where: { id: User.id },
      });
      const city = await models.City.findAll();
      // Lấy danh sách món ăn cho nhà hàng
      const dishes = await models.Dish.findAll({
        where: { restaurant_id },
      });
      if (!user) {
        console.log("User not found in database");
        return res.redirect("/login"); // Chuyển hướng nếu không tìm thấy người dùng
      }

      // Render trang đổi mật khẩu với thông tin người dùng
      res.render("user.view/profile.view/dish_menu", {
        User: user,
        dish: dishes,
        restaurant_id: restaurant_id,
        City: city,
      });
    } catch (error) {
      console.error("Error rendering dish_menu page:", error);
      req.flash("errors", { msg: "Error fetching user:" });
    }
  }
  public async dish_menu(req: Request, res: Response) {
    const { dishes_name, city_id, price, description } = req.body;
    const file = req.file ? convertFileToBase64(req.file) : null;

    const { restaurant_id } = req.params; // Lấy restaurant_id từ params
    console.log("Restaurant ID from params:", restaurant_id); // Kiểm tra giá trị restaurant_id
    if (!req.session || !req.session.user) {
      console.log("User session not found");
      return res.redirect("/"); // Chuyển hướng về trang chính nếu không có session
    }

    const User = req.session.user;

    try {
      console.log("Received dish data:", {
        dishes_name,
        city_id,
        price,
        description,
        restaurant_id,
      });

      // Tạo mới món ăn
      await models.Dish.create({
        name: dishes_name,
        price,
        img: file, // Lưu file dưới dạng Base64
        description,
        city_id,
        main_dish: false,
        user_id: User.id,
        restaurant_id,
      });

      // Thông báo thành công
      req.flash("success", { msg: `Created dish successfully!` });
      return res.redirect(`/api/v1/user/dish_menu/${restaurant_id}`);
    } catch (error) {
      console.error("Error creating dish:", error);
      req.flash("errors", {
        msg: "An error occurred while creating the dish.",
      });
      return res.redirect(`/api/v1/user/dish_menu/${restaurant_id}`);
    }
  }
}
