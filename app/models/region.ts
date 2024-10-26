import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { City } from "./city";

export interface RegionAttributes {
  region_id?: number;
  region_name?: string;
}

export interface RegionInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  region_id: number;
  region_name: string;
}

export const Region = sequelize.define("Region", {
  region_id: Sequelize.INTEGER,
  region_name: Sequelize.STRING,
});

export const associate = () => {
  // Một region có nhiều cities
  Region.hasMany(City, { foreignKey: "region_id" });
};

export default { Region, associate };
