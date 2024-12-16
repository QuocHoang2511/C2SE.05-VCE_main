import env from "@configs/env";
import { convertFileToBase64 } from "@configs/fileUpload";
import models from "@models";
import { Role, UserInstance } from "@models/user";
import axios from "axios";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class AuthController extends ApplicationController {
  public async loginWithGoogle(req: Request, res: Response) {
    const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.googleClientId}&redirect_uri=${env.googleRedirectUri}&response_type=code&scope=profile email`;
    console.log("Google OAuth URL:", googleOAuthURL);
    res.redirect(googleOAuthURL);
  }

  public async loginWithGoogleRedirect(req: Request, res: Response) {
    const { code } = req.query;
    const {
      data: { access_token },
    } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      code,
      redirect_uri: env.googleRedirectUri,
      grant_type: "authorization_code",
    });
    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const loginUser = (await models.User.findOne({
      where: {
        email: googleUser.email,
      },
    })) as UserInstance;

    if (!loginUser) {
      const newUser = (await models.User.create({
        username: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        role: Role.USER,
        password: null,
        adress: null,
        phone: null,
      })) as UserInstance;

      req.session.userId = newUser.id;
    } else {
      await models.User.update(
        {
          name: googleUser.name,
          email: googleUser.email,
          avatarUrl: googleUser.picture,
        },
        {
          where: {
            id: loginUser.id,
          },
        }
      );

      req.session.userId = loginUser.id;
    }

    req.flash("success", { msg: "Login successfully" });

    res.redirect("/");
  }

  public async index(req: Request, res: Response) {
    res.render("auth.view/signin");
  }

  public async forgotPasswordUserIndex(req: Request, res: Response) {
    res.render("auth.view/forgotpassword"); // Hiển thị form quên mật khẩu
  }

  public async forgotPasswordUser(req: Request, res: Response) {
    const { email } = req.body;

    const user = await models.User.findOne({
      where: { email },
    });

    if (!user) {
      // Kiểm tra nếu không tìm thấy người dùng
      req.flash("errors", { msg: "Email không tồn tại." });
      res.redirect("/api/v1/auth/forgotpassword"); // Quay lại trang Forgot Password nếu email không tồn tại
    } else {
      req.flash("success", { msg: "Email đã được gửi. Vui lòng kiểm tra!" });
      res.redirect(`/api/v1/auth/setpassword/${email}`); // Chuyển tới trang setpassword nếu email tồn tại
      console.log(email);
    }
  }
  public async setPasswordUserIndex(req: Request, res: Response) {
    const { email } = req.params; // Lấy email từ params
    res.render("auth.view/setpassword", { email }); // Truyền email vào template
  }
  public async setPasswordUser(req: Request, res: Response) {
    const { confirmPassword, password } = req.body;
    const { email } = req.params; // Lấy email từ params

    console.log("Email từ params:", email); // Kiểm tra giá trị email
    console.log("Dữ liệu từ form:", req.body); // Kiểm tra dữ liệu từ form

    const user = (await models.User.findOne({
      where: { email },
    })) as UserInstance;

    if (!user) {
      console.log(`Không tìm thấy người dùng với email: ${email}`); // Thêm thông tin debug
      req.flash("errors", { msg: "Người dùng không tồn tại." });
      return res.redirect("/api/v1/auth/forgotpassword");
    }

    // Cập nhật mật khẩu mới
    await models.User.update(
      { password }, // Dữ liệu cần cập nhật
      { where: { email } } // Điều kiện
    );

    req.flash("success", { msg: "Đặt lại mật khẩu thành công." });
    res.redirect("/api/v1/auth/signin");
  }

  public async createUser(req: Request, res: Response) {
    const { username, email, adress, phone, confirmPassword, password } =
      req.body;
    const file = req.file ? convertFileToBase64(req.file) : null;
    console.log("File received:", req.body.file); // Kiểm tra file nhận được
    // console.log("File converted:", file); // Kiểm tra file sau khi convert

    console.log(req.body); // Kiểm tra dữ liệu từ form
    console.log("password", confirmPassword, password);
    if (confirmPassword !== password) {
      req.flash("errors", { msg: "Confirm password does not match." });
      return res.redirect("/api/v1/auth/signup");
    }

    try {
      const users = (await models.User.create({
        username: username,
        email: email,
        avatar: file,
        role: Role.ADMIN,
        password: password,
        adress: adress,
        phone: phone,
      })) as UserInstance;

      const User = (req.session.user = {
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        role: users.role,
      });

      req.flash("success", { msg: `Created user ${users.username}` });
      res.redirect("/api/v1/auth/signin");
    } catch (error) {
      // Lỗi khi tạo user
      console.error("Error creating user:", error); // Thêm câu lệnh để kiểm tra lỗi chi tiết
      req.flash("errors", {
        msg: "An error occurred while creating the user.",
      });
      res.redirect("/api/v1/auth/signup");
    }
  }

  public async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = (await models.User.findOne({
      where: {
        email,
        password: password,
      },
    })) as UserInstance;

    if (user) {
      const User = (req.session.user = {
        id: user.id,
        role: user.role,
      });

      console.log(" User=req.session: ", User);
      req.flash("success", { msg: "Login successfully" });
      res.redirect("/");
    } else {
      req.flash("errors", { msg: "User is not found." });
      res.redirect("/api/v1/auth/signin");
    }
  }

  public async new(req: Request, res: Response) {
    res.render("auth.view/signup");
  }

  public async destroy(req: Request, res: Response) {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).redirect("/");
        }
        return res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  }
}
