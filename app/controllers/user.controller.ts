import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { UserInstance } from "../models/user";

export class UserController extends ApplicationController {
  // Render trang profile.pug
  public async index(req: Request, res: Response) {
    res.render("user.view/profile", { User: req.session.user });
  }

  // Render trang editprofile.pug
  public async editProfileindex(req: Request, res: Response) {
    res.render("user.view/profile.view/editprofile", {
      User: req.session.user,
    });
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
      req.session.user = {
        ...req.session.user,
        username,
        adress: address,
        email,
        phone,
      };
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
    res.render("user.view/profile.view/changepassword", {
      User: req.session.user,
    });
  }
}
