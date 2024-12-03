import cityModel, { City } from "./city";
import dishModel, { Dish } from "./dish";
import feedbackModel, { Feedback } from "./feedback";
import profileModel, { Profile } from "./profile";
import regionModel, { Region } from "./region";
import restaurantModel, { Restaurant } from "./restaurant";
import userModel, { User } from "./user";

// Gọi hàm associate cho tất cả các model
userModel.associate();
cityModel.associate();
dishModel.associate();
feedbackModel.associate();
profileModel.associate();
regionModel.associate();
restaurantModel.associate();

export default {
  User,
  City,
  Dish,
  Feedback,
  Profile,
  Region,
  Restaurant,
};
