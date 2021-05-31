import React from "react";
import NutritionScreenHeader from "./NutritionScreenHeader";
import "./Nutrition.css";

function CoachNutritionHome() {
  return (
    <div className="coachNutritionHome">
      <NutritionScreenHeader name="Nutrition" />
      <div className="coachNutritionHome__assignedMealPlans">
        <div className="assignedMealPlans__headings">
          <h3>Assigned Meal Plans</h3>
          <h4>View All</h4>
        </div>
      </div>
      <div className="coachNutritionHome__savedMealPlans">
        <div className="savedMealPlans__headings">
          <h3>Saved Meal Plans</h3>
          <h4>View All</h4>
        </div>
      </div>
    </div>
  );
}

export default CoachNutritionHome;
