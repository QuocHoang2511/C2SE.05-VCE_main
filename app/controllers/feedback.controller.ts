import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { FeedbackInstance } from "../models/feedback"; // Import kiểu FeedbackInstance từ model
import { UserInstance } from "../models/user";

export class FeedbackController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const { restaurant_id } = req.params; // Lấy restaurant_id từ params
    try {
      // Lấy danh sách món ăn của nhà hàng
      const dishes = await models.Dish.findAll({
        where: { restaurant_id },
      });

      // Lấy danh sách feedback của nhà hàng
      const feedbacks = (await models.Feedback.findAll({
        where: { restaurant_id },
        include: [
          {
            model: models.User,
            attributes: ["id", "username", "avatar"],
          },
        ],
      })) as (FeedbackInstance & { User: UserInstance })[]; // Ép kiểu feedbacks thành một mảng kết hợp

      // Kiểm tra nếu User và avatar tồn tại
      feedbacks.forEach((feedback) => {
        if (feedback.User && feedback.User.avatar) {
          // Kiểm tra nếu avatar là Buffer trước khi chuyển đổi sang base64
          if (Buffer.isBuffer(feedback.User.avatar)) {
            feedback.User.avatar = feedback.User.avatar.toString("base64");
          }
        }
      });

      console.log("feed back : 11:", feedbacks[0]);

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

      // Render trang feedback

      res.render("feedback.view/index", {
        User: user,
        dishes,
        feedback: feedbacks,
        restaurant_id,
      });
    } catch (error) {
      console.error("Error fetching restaurants or user:", error);
      req.flash("errors", {
        msg: "An error occurred while loading feedbacks.",
      });
      res.redirect("/error"); // Chuyển hướng đến trang lỗi (nếu có)
    }
  }
  // Phương thức POST để tạo mới feedback
  public async create(req: Request, res: Response) {
    const { restaurant_id } = req.params; // Lấy restaurant_id từ params
    const { content, rating } = req.body; // Lấy nội dung và điểm đánh giá từ form

    try {
      // Kiểm tra nếu người dùng đã đăng nhập
      if (!req.session?.user) {
        req.flash("errors", {
          msg: "You must be logged in to leave feedback.",
        });
        return res.redirect(`/api/v1/auth/signin`);
      }

      // Tạo feedback mới
      const feedback = await models.Feedback.create({
        user_id: req.session.user.id, // user_id lấy từ session
        restaurant_id,
        content,
        rating,
      });

      // Sau khi tạo thành công, chuyển hướng đến trang feedback của nhà hàng
      req.flash("success", {
        msg: "Your feedback has been submitted successfully.",
      });
      res.redirect(`/api/v1/feedback/${restaurant_id}`);
    } catch (error) {
      console.error("Error creating feedback:", error);
      req.flash("errors", {
        msg: "An error occurred while submitting your feedback.",
      });
      res.redirect(`/api/v1/feedback/${restaurant_id}`);
    }
  }
}
