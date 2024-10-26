import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export interface FeedbackAttributes {
  user_id?: number;
  restaurant_id?: number;
  dish_id?: number;
  content?: string;
  rating?: number;
}

export interface FeedbackInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user_id: number;
  restaurant_id: number;
  dish_id: number;
  content: string;
  rating: number;
}

export const Feedback = sequelize.define("Feedback", {
  user_id: Sequelize.INTEGER,
  restaurant_id: Sequelize.INTEGER,
  dish_id: Sequelize.INTEGER,
  content: Sequelize.STRING,
  rating: Sequelize.INTEGER,
});

export const associate = () => {
  // Một feedback thuộc về một user
  Feedback.belongsTo(User, { foreignKey: "user_id" });

  // Một feedback thuộc về một restaurant
  Feedback.belongsTo(Restaurant, { foreignKey: "restaurant_id" });
};

export default { Feedback, associate };
