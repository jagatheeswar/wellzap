import React from "react";
import "./Nutrition.css";
import NutritionScreenHeader from "./NutritionScreenHeader";

function AthleteAddMeal() {
  return (
    <div className="athleteAddMeal">
      <NutritionScreenHeader name="Add Meal" />
      <div className="athleteAddMeal__typeOfMeal"></div>
    </div>
  );
}

export default AthleteAddMeal;
