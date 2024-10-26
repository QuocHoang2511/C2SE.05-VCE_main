import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { City } from "./city";
import { Dish } from "./dish";
import { Feedback } from "./feedback";
import { User } from "./user";

export interface RestaurantAttributes {
  restaurant_name?: string;
  address?: string;
  phone_number?: string;
  category?: string;
  main_dishes?: string;
  city_id?: number;
  description?: number;
  approved?: boolean;
  admin_id?: number;
  user_id?: number;
}

export interface RestaurantInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  restaurant_name: string;
  address: string;
  phone_number: string;
  category: string;
  main_dishes: string;
  city_id: number;
  description: number;
  approved: boolean;
  admin_id: number;
  user_id: number;
}

export const Restaurant = sequelize.define("Restaurant", {
  restaurant_name: Sequelize.STRING,
  address: Sequelize.STRING,
  phone_number: Sequelize.STRING,
  category: Sequelize.STRING,
  main_dishes: Sequelize.STRING,
  city_id: Sequelize.INTEGER,
  description: Sequelize.INTEGER,
  approved: Sequelize.BOOLEAN,
  admin_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
});

export const associate = () => {
  // Một restaurant thuộc về một user
  Restaurant.belongsTo(User, { foreignKey: "user_id" });

  // Một restaurant có nhiều dishes
  Restaurant.hasMany(Dish, { foreignKey: "restaurant_id" });

  // Một restaurant thuộc về một city
  Restaurant.belongsTo(City, { foreignKey: "city_id" });

  // Một restaurant có nhiều feedback
  Restaurant.hasMany(Feedback, { foreignKey: "restaurant_id" });
};

export default { Restaurant, associate };
