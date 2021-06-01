import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserType } from "../../features/userSlice";
import "./Nutrition.css";

function NutritionScreenHeader({ name }) {
  const userType = useSelector(selectUserType);
  const history = useHistory();

  return (
    <div className="nutritionScreenHeader">
      <div className="nutritionHeader__info">
        <div
          className="nutritionHeader__backButton"
          onClick={() => history.goBack()}
        >
          <img src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <h1>{name}</h1>
      </div>

      {name === "Nutrition" && (
        <div
          className="addNutrition__button"
          onClick={() => history.push("/add-meal")}
        >
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
          <h5>ADD MEAL</h5>
        </div>
      )}
    </div>
  );
}

export default NutritionScreenHeader;
