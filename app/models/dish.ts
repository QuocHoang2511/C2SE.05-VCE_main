import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { Restaurant } from "./restaurant";

export interface DishAttributes {
  name?: string;
  restaurant_id?: number;
  description?: string;
  price?: number;
  img?: string;
  approved?: boolean;
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
  approved: boolean;
}

export const Dish = sequelize.define("Dish", {
  name: Sequelize.STRING,
  restaurant_id: Sequelize.INTEGER,
  description: Sequelize.STRING,
  price: Sequelize.FLOAT,
  img: Sequelize.STRING,
  approved: Sequelize.BOOLEAN,
});

export const associate = () => {
  // Một dish thuộc về một restaurant
  Dish.belongsTo(Restaurant, { foreignKey: "restaurant_id" });
};

export default { Dish, associate };
