import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { City } from "./city";
import { Restaurant } from "./restaurant";
import { User } from "./user";

export interface DishAttributes {
  name?: string;
  restaurant_id?: number;
  description?: string;
  price?: number;
  img?: string;
  city_id?: number;
  user_id?: number;
  main_dish?: boolean;
}

export interface DishInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  name: string;
  restaurant_id: number;
  description: string;
  price: number;
  img: string;
  city_id?: number;
  user_id?: number;
  main_dish?: boolean;
}

export const Dish = sequelize.define("Dish", {
  name: Sequelize.STRING,
  restaurant_id: Sequelize.INTEGER,
  description: Sequelize.STRING,
  price: Sequelize.FLOAT,
  img: Sequelize.STRING,
  city_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
  main_dish: Sequelize.BOOLEAN,
});

export const associate = () => {
  // Một dish thuộc về một restaurant
  Dish.belongsTo(Restaurant, { foreignKey: "restaurant_id" });
  // Một dish thuộc về một user
  Dish.belongsTo(User, { foreignKey: "user_id" });

  // Một user có thể có nhiều món ăn
  User.hasMany(Dish, { foreignKey: "user_id" });
  City.belongsToMany(Dish, {
    through: "CityDishes",
    foreignKey: "city_id",
    as: "dishes",
  });
  Dish.belongsToMany(City, {
    through: "CityDishes",
    foreignKey: "dish_id",
    as: "cities",
  });
};

export default { Dish, associate };
