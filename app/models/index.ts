import cityModel, { City } from "./city";
import dishModel, { Dish } from "./dish";
import featureDishModel, { FeatureDish } from "./featuredish";
import feedbackModel, { Feedback } from "./feedback";
import profileModel, { Profile } from "./profile";
import regionModel, { Region } from "./region";
import restaurantModel, { Restaurant } from "./restaurant";
import userModel, { User } from "./user";

// Gọi hàm associate cho tất cả các model
userModel.associate();
cityModel.associate();
dishModel.associate();
featureDishModel.associate();
feedbackModel.associate();
profileModel.associate();
regionModel.associate();
restaurantModel.associate();

export default {
  User,
  City,
  Dish,
  FeatureDish,
  Feedback,
  Profile,
  Region,
  Restaurant,
};
