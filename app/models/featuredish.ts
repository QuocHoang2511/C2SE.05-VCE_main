import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { User } from "./user";

export interface FeatureDishAttributes {
  featured_dish_id?: number;
  dish_id?: number;
  user_id?: number;
}

export interface FeatureDishInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  featured_dish_id: number;
  dish_id: number;
  user_id: number;
}

export const FeatureDish = sequelize.define("FeatureDish", {
  featured_dish_id: Sequelize.INTEGER,
  dish_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
});

export const associate = () => {
  // Một featured dish thuộc về một user
  FeatureDish.belongsTo(User, { foreignKey: "user_id" });
};

export default { FeatureDish, associate };
