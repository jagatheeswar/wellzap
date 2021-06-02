import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./Nutrition.css";
import NutritionScreenHeader from "./NutritionScreenHeader";

function AssignedNutrition() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mealType, setMealType] = useState("");

  useEffect(() => {}, []);
  const history = useHistory();
  return (
    <div className="assignedNutrition">
      <NutritionScreenHeader name="Assigned Nutrition" />
      <img src="/assets/nutrition.jpeg" alt="" />
      <h4>Nutrition Plan Name</h4>
      <div
        className="assignedNutrition__button"
        onClick={() => history.push("/nutrition")}
      >
        Return
      </div>
    </div>
  );
}

export default AssignedNutrition;
