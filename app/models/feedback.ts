import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export interface FeedbackAttributes {
  user_id?: number;
  restaurant_id?: number;
  content?: string;
  rating?: number;
  sentiment: number;
}

export interface FeedbackInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  user_id: number;
  restaurant_id: number;
  content: string;
  rating: number;
  sentiment: number;
}

export const Feedback = sequelize.define("Feedback", {
  user_id: Sequelize.INTEGER,
  restaurant_id: Sequelize.INTEGER,
  content: Sequelize.STRING,
  rating: Sequelize.INTEGER,
  sentiment: Sequelize.INTEGER,
});

export const associate = () => {
  Feedback.belongsTo(User, { foreignKey: "user_id" });
  Feedback.belongsTo(Restaurant, { foreignKey: "restaurant_id" });
  User.hasMany(Feedback, { foreignKey: "user_id" });
};

export default { Feedback, associate };
