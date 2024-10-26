import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { User } from "./user";

export interface ProfileAttributes {
  profile_id?: number;
  user_id?: number;
  favorite_restaurants?: string;
}

export interface ProfileInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  profile_id: number;
  user_id: number;
  favorite_restaurants: string;
}

export const Profile = sequelize.define("Profile", {
  profile_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
  favorite_restaurants: Sequelize.STRING,
});

export const associate = () => {
  // Một profile thuộc về một user
  Profile.belongsTo(User, { foreignKey: "user_id" });
};

export default { Profile, associate };
