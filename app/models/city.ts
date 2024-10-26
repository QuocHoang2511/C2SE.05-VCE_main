import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { Region } from "./region";
import { Restaurant } from "./restaurant";

export interface CityAttributes {
  city_id?: number;
  region_id?: number;
  region_name?: string;
}

export interface CityInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  city_id: number;
  region_id: number;
  region_name: string;
}

export const City = sequelize.define("City", {
  city_id: Sequelize.INTEGER,
  region_id: Sequelize.INTEGER,
  region_name: Sequelize.STRING,
});

export const associate = () => {
  // Một city thuộc về một region
  City.belongsTo(Region, { foreignKey: "region_id" });

  // Một city có nhiều restaurants
  City.hasMany(Restaurant, { foreignKey: "city_id" });
};

export default { City, associate };
