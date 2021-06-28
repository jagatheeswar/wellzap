import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import "./NutritionCard.css";

function NutritionCard({ nutrition, food, idx, type, navigation ,isLongTerm,handleCloseNutrition,setWeeks,weeks,selectedWeekNum,selectedDay}) {
  const userType = useSelector(selectUserType);
  const history = useHistory();
  console.log("fd", food);
  return (
    <div className="nutritionCard">
      <div className="nutritionCard_main">
      <img src="/assets/nutrition.jpeg" alt="" width="110px" height="110px" />
      <div
        className="nutritionCard__info"
        onClick={
          () => {
            if(isLongTerm){
              var lweeks = weeks;
              var lselectedWeekNum = selectedWeekNum;
              var lselectedDay = selectedDay;
              lweeks[lselectedWeekNum - 1].days[lselectedDay] = food.data;
              var ent = food.data?.nutrition?.entireFood;
              var calories =0;
              var proteins = 0;
              var carbs =0;
              var fat =0;
              ent.forEach((id)=>{
                var dat = id.food;
                dat.forEach((id2)=>{
                  calories += id2.calories;
                  fat += id2.fat;
                  carbs += id2.carbs;
                  proteins +=id2.proteins;
                })
              })
              lweeks[lselectedWeekNum - 1].days[lselectedDay].calories = calories;
              lweeks[lselectedWeekNum - 1].days[lselectedDay].proteins = proteins;
              lweeks[lselectedWeekNum - 1].days[lselectedDay].fat = fat;
              lweeks[lselectedWeekNum - 1].days[lselectedDay].carbs = carbs;
              setWeeks(lweeks)
              handleCloseNutrition()
            }else{
            if (userType === "coach") {
              if (type === "view") {
                history.push({
                  pathname: "/view-nutrition",
                  state: { nutrition: food, type: "view" },
                });
              } else {
                if (food.data.assignedTo_id === "") {
                  history.push({
                    pathname: "/view-nutrition",
                    state: { nutrition: food, type: "create" },
                  });
                } else {
                  history.push({
                    pathname: "/view-nutrition",
                    state: { nutrition: food, type: "update" },
                  });
                }
              }
            } else {
              history.push({
                pathname: "/view-nutrition",
                state: {
                  nutrition: food,
                },
              });
            }
          }
          }
          //console.log(food);
          // history.push({
          //   pathname: "/view-nutrition",
          //   state: { food: food, editable: type == "editable" },
          // });
        }
      >
        <div className="nutritionCard__macroNutrients">
          <h1> {food?.data?.nutrition?.nutritionName}</h1>
        </div>
        <div className="nutritionCard__macroNutrients">
          <h3>{formatDate()}</h3>
        </div>
      </div>
      </div>
      <img className="right__arrow" src="/assets/right__arrow.png" alt="" />
    </div>
  );
}

export default NutritionCard;
