import { Request, Response } from "express";
import { ApplicationController } from ".";
import models from "../models";
import { FeedbackInstance } from "../models/feedback";

export class RestaurantController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const { main_dish } = req.params;
    try {
      console.log("main_dish param received:", main_dish);

      const page = parseInt(req.query.page as string) || 1;
      const limit = 4;
      const offset = (page - 1) * limit;

      const whereCondition: any = { approved: true };
      if (main_dish) whereCondition.main_dishes = parseInt(main_dish);

      // Truy vấn danh sách nhà hàng
      const restaurants = await models.Restaurant.findAll({
        where: whereCondition,
        include: [
          {
            model: models.Feedback,
            attributes: ["rating", "sentiment"],
            as: "Feedbacks",
          },
        ],
      });

      console.log("Restaurants fetched:", restaurants);

      // Xử lý dữ liệu feedback
      const calculateSentimentAndRating = (feedbacks: FeedbackInstance[]) => {
        let count_pos = 0,
          count_neg = 0;

        feedbacks.forEach((feedback) => {
          if (feedback.sentiment === 2) ++count_pos;
          else if (feedback.sentiment === 0) ++count_neg;
        });

        const totalFeedbacks = count_pos + count_neg;
        const averageRating =
          feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
          (feedbacks.length || 1);
        const percent_pos =
          totalFeedbacks > 0 ? (count_pos / totalFeedbacks) * 100 : 0;

        return { averageRating, percent_pos };
      };

      // Enrich dữ liệu nhà hàng
      const enrichedRestaurants = restaurants.map((restaurant) => {
        const feedbacks = (restaurant as any).Feedbacks as FeedbackInstance[];
        const { averageRating, percent_pos } = calculateSentimentAndRating(
          feedbacks || []
        );

        return {
          ...(restaurant as any).get({ plain: true }),
          averageRating,
          percent_pos,
        };
      });

      enrichedRestaurants.sort((a, b) => b.percent_pos - a.percent_pos);

      // Phân trang
      const paginatedRestaurants = enrichedRestaurants.slice(
        offset,
        offset + limit
      );
      const totalPages = Math.ceil(enrichedRestaurants.length / limit);

      res.render("restaurant.view/index", {
        restaurant: paginatedRestaurants,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.redirect("/error");
    }
  }
}
