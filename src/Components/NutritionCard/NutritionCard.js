import React from "react";
import { useSelector } from "react-redux";
import { selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import "./NutritionCard.css";

function NutritionCard({ nutrition, food, idx, type, navigation }) {
  const userType = useSelector(selectUserType);

  return (
    <div className="nutritionCard">
      <img src="/assets/nutrition.jpeg" alt="" width="110px" height="110px" />
      <div className="nutritionCard__info">
        <div className="nutritionCard__macroNutrients">
          <h1> {food?.data?.nutrition?.nutritionName}</h1>
        </div>
        <div className="nutritionCard__macroNutrients">
          <h3>{formatDate()}</h3>
        </div>
      </div>
      <img className="right__arrow" src="/assets/right__arrow.png" alt="" />
    </div>
  );
}

export default NutritionCard;
