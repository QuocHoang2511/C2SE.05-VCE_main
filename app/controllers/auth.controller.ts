import env from "@configs/env";
import models from "@models";
import { Role, UserInstance } from "@models/user";
import axios from "axios";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class AuthController extends ApplicationController {
  public async loginWithGoogle(req: Request, res: Response) {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.googleClientId}&redirect_uri=${env.googleRedirectUri}&response_type=code&scope=profile email`
    );
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

  public async createUser(req: Request, res: Response) {
    const { confirmPassword, password } = req.body;
    console.log(req.body); // Kiểm tra dữ liệu từ form
    console.log("password", confirmPassword, password);
    if (confirmPassword !== password) {
      req.flash("errors", { msg: "Confirm password does not match." });
      return res.redirect("/api/v1/auth/signup");
    }

    try {
      const users = (await models.User.create({
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
        role: Role.USER,
        password: req.body.password,
        adress: req.body.adress,
        phone: req.body.phone,
      })) as UserInstance;
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

    const user = await models.User.findOne({
      where: {
        email,
        password: password,
      },
    });

    if (user) {
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
    req.session.destroy((err: Error) => {
      if (err) console.log(err);
      else {
        res.redirect("https://accounts.google.com/logout");
      }
    });
  }
}
