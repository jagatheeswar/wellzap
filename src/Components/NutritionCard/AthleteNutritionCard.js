import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUserType, selectUserData } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import "./NutritionCard.css";
import { db } from "../../utils/firebase";
import CloseIcon from "@material-ui/icons/Close";

export function formatDate1(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function AthleteNutritionCard({
  nutrition,
  food,
  idx,
  type,
  navigation,
  coachMealHistory,
  selectedWeekNum,
  isLongTerm,
  weeks,
  handleCloseNutrition,
  setWeeks,

  food_nutrition,
}) {
  const userType = useSelector(selectUserType);
  const history = useHistory();
  const userData = useSelector(selectUserData);

  // const isLongTerm = false;
  return (
    <div
      className="nutritionCard"
      style={{ position: "relative" }}
      onClick={
        () => {
          if (isLongTerm) {
            // var lweeks = weeks;
            // //console.log("before")
            // //console.log(lweeks)
            // var lselectedWeekNum = selectedWeekNum;
            // var lselectedDay = selectedDay;
            // lweeks[lselectedWeekNum - 1].days[lselectedDay] = food.data;
            // var ent = food.data?.nutrition?.entireFood;
            // var calories = 0;
            // var proteins = 0;
            // var carbs = 0;
            // var fat = 0;
            // ent.forEach((id) => {
            //   var dat = id.food;
            //   dat.forEach((id2) => {
            //     calories += id2.calories;
            //     fat += id2.fat;
            //     carbs += id2.carbs;
            //     proteins += id2.proteins;
            //   });
            // });
            // lweeks[lselectedWeekNum - 1].days[lselectedDay].calories =
            //   calories;
            // lweeks[lselectedWeekNum - 1].days[lselectedDay].proteins =
            //   proteins;
            // lweeks[lselectedWeekNum - 1].days[lselectedDay].fat = fat;
            // lweeks[lselectedWeekNum - 1].days[lselectedDay].carbs = carbs;
            // //console.log("nutri card")
            // //console.log(lweeks)
            // setWeeks(lweeks);
            // handleCloseNutrition();
          } else {
            if (userType === "coach") {
              // if (type === "view") {
              //   history.push({
              //     pathname: "/view-nutrition",
              //     state: { nutrition: food, type: "view" },
              //   });
              // } else {
              //   if (food.data.assignedTo_id === "") {
              //     history.push({
              //       pathname: "/view-nutrition",
              //       state: { nutrition: food, type: "create" },
              //     });
              //   } else {
              //     history.push({
              //       pathname: "/view-nutrition",
              //       state: { nutrition: food, type: "update" },
              //     });
              //   }
              // }
            } else {
              if (navigation) {
                history.push({
                  pathname: "/add-meal",
                  state: {
                    entireFood: food.data.entireFood,
                    todaysFoodId: food.id,
                    nutrition: coachMealHistory && coachMealHistory[0],
                  },
                });
              } else {
                history.push({
                  pathname: "/view-nutrition",
                  state: {
                    nutrition: food,
                    type: "view",
                  },
                });
              }
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
      <div
        className="nutritionCard_main"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src="/assets/nutrition.jpeg" alt="" width="110px" height="110px" />
        <div
          className="nutritionCard__info"
          style={{
            marginLeft: 10,
          }}
        >
          <div
            className="nutritionCard__macroNutrients"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              fontSize: 12,
              fontWeight: 400,
              height: 70,
            }}
          >
            {food?.data?.nutrition?.nutritionName && (
              <h1> {food?.data?.nutrition?.nutritionName}</h1>
            )}

            <div
              style={{
                display: "flex",
              }}
            >
              <div style={{ width: 70 }}>Carbs :</div>
              {food.data?.carbs ? food.data?.carbs?.toFixed(2) : 0}
            </div>

            <div
              style={{
                display: "flex",
              }}
            >
              {" "}
              <div style={{ width: 70 }}>Calories :</div>
              {food.data?.calories ? food.data?.calories?.toFixed(2) : 0}
            </div>

            <div
              style={{
                display: "flex",
              }}
            >
              {" "}
              <div style={{ width: 70 }}>Fats :</div>{" "}
              {food.data?.fat ? food.data?.fat?.toFixed(2) : 0}
            </div>

            <div
              style={{
                display: "flex",
              }}
            >
              {" "}
              <div style={{ width: 70 }}>Proteins :</div>
              {food.data?.proteins ? food.data?.proteins?.toFixed(2) : 0}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: 10,
          width: 100,
        }}
        className="nutritionCard__macroNutrients"
      >
        <h3>{food.id ? food.id : formatDate()}</h3>
        <img className="right__arrow" src="/assets/right__arrow.png" alt="" />
      </div>
      {userType === "athlete" && (
        <div
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={(e) => {
            e.stopPropagation();
            var r = window.confirm("are you sure to delete!");
            if (r == true) {
              db.collection("AthleteNutrition")
                .doc(userData?.id)
                .collection("nutrition")
                .doc(food.id)
                .delete()
                .then(() => {
                  console.log("Document successfully deleted!");
                })
                .catch((error) => {
                  console.error("Error removing document: ", error);
                });
            } else {
            }
          }}
        >
          <CloseIcon
            style={{
              width: 30,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AthleteNutritionCard;
