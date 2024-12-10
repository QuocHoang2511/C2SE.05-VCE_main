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
  main_dishes?: number;
  city_id?: number;
  description?: string;
  approved?: boolean;
  user_id?: number;
  img_restaurant?: string;
  favourite?: boolean;
}

export interface RestaurantInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  restaurant_name: string;
  address: string;
  phone_number: string;
  main_dishes: number;
  city_id: number;
  description: string;
  approved: boolean;
  user_id: number;
  img_restaurant: string;
  favourite?: boolean;
}

export const Restaurant = sequelize.define("Restaurant", {
  restaurant_name: Sequelize.STRING,
  address: Sequelize.STRING,
  phone_number: Sequelize.STRING,
  main_dishes: Sequelize.INTEGER,
  city_id: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  approved: Sequelize.BOOLEAN,
  user_id: Sequelize.INTEGER,
  img_restaurant: Sequelize.BLOB,
  favourite: Sequelize.BOOLEAN,
});

export const associate = () => {
  // Một restaurant thuộc về một user
  Restaurant.belongsTo(User, { foreignKey: "user_id" });

  // Một restaurant có nhiều dishes
  Restaurant.hasMany(Dish, { foreignKey: "restaurant_id" });

  // Một restaurant thuộc về một city
  Restaurant.hasOne(City, {
    foreignKey: "city_id", // Giả sử city_id là khóa ngoại trong bảng Dish
    as: "city", // Alias quan hệ
  }); // Một restaurant có nhiều feedback
  Restaurant.hasMany(Feedback, { foreignKey: "restaurant_id" });
};

export default { Restaurant, associate };
