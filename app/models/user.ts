import sequelize from "@configs/database";
import { Sequelize } from "sequelize";
import { Feedback } from "./feedback";
import { Profile } from "./profile";
import { Restaurant } from "./restaurant";
export enum Role {
  ADMIN = 0,
  USER = 1,
}
export interface UserAttributes {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  phone?: string;
  adress?: string;
  role?: Role;
}

export interface UserInstance {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  username: string;
  email: string;
  password: string;
  avatar: string;
  phone: string;
  adress: string;
  role: Role;
}

export const User = sequelize.define("User", {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  avatar: Sequelize.BLOB,
  phone: Sequelize.STRING,
  adress: Sequelize.STRING,
  role: Sequelize.INTEGER,
});

export const associate = () => {
  // Một user có nhiều profiles
  User.hasMany(Profile, { foreignKey: "user_id" });

  // Một user có nhiều restaurants
  User.hasMany(Restaurant, { foreignKey: "user_id" });

  // Một user có nhiều featured dishes

  // Một user có nhiều feedback
  User.hasMany(Feedback, { foreignKey: "user_id" });
};
export default { User, associate };
