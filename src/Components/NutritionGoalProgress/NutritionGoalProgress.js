import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import ProgressBarComponent from "../ProgressComponent/ProgressBarComponent";
import "./NutritionGoalProgress.css";
import ProgressCircle from "./ProgressCircle";

function NutritionGoalProgress() {
  const userData = useSelector(selectUserData);
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [userFat, setUserFat] = useState(
    userData?.data?.diet ? userData.data.diet.fat : 50
  );
  const [userCarbs, setUserCarbs] = useState(
    userData?.data?.diet ? userData.data.diet.carbs : 300
  );
  const [userProtein, setUserProtein] = useState(
    userData?.data?.diet ? userData.data.diet.protein : 70
  );
  const [userCalories, setUserCalories] = useState(
    userData?.data?.diet ? userData.data.diet.calories : 1930
  );
  const [protein, setProtein] = useState("");
  const [entireFood, setEntireFood] = useState([]);
  const [caloriesBarColor, setCaloriesBarColor] = useState("");
  const [todaysFoodId, setTodaysFoodId] = useState("");

  useEffect(() => {
    if (userData?.data) {
      db.collection("athletes")
        .doc(userData.id)
        .onSnapshot((doc) => {
          setUserProtein(doc.data()?.diet?.protein);
          setUserFat(doc.data()?.diet?.fat);
          setUserCarbs(doc.data()?.diet?.carbs);
          setUserCalories(doc.data()?.diet?.calories);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    let tempCal = 0;
    let tempCarbs = 0;
    let tempFat = 0;
    let tempProtein = 0;
    console.log("useEffect in nutrition goal");
    if (userData) {
      let tempDate;
      tempDate = formatDate();

      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .doc(tempDate)
        .onSnapshot((querySnapshot) => {
          tempCal = 0;
          tempCarbs = 0;
          tempFat = 0;
          tempProtein = 0;
          querySnapshot.forEach((doc) => {
            if (doc.data().entireFood) {
              setEntireFood(doc.data().entireFood);
              setTodaysFoodId(doc.id);
              doc.data().entireFood.map((foodContainer) => {
                foodContainer.food.map((f) => {
                  tempCal = tempCal + f.calories;
                  tempCarbs = tempCarbs + f.carbs;
                  tempFat = tempFat + f.fat;
                  tempProtein = tempProtein + f.proteins;
                });
              });
            }
          });
          console.log(tempCal);
          setCalories(tempCal.toFixed(2));
          setCarbs(tempCarbs.toFixed(2));
          setFat(tempFat.toFixed(2));
          setProtein(tempProtein.toFixed(2));
        });
    }
  }, ["", userData?.id]);

  return (
    <div
      className="nutritionGoalProgress"
      onClick={() => {
        // navigation.navigate("AddMeal", {
        //   entireFood: entireFood,
        //   todaysFoodId: todaysFoodId,
        // });
      }}
    >
      <div className="nutritionGoalProgress__container">
        <div className="nutritionGoalProgress__leftContainer">
          <ProgressCircle progress={calories / userCalories} />
          <div className="nutritionGoalProgress__calories">
            <h2>
              {calories} / {userCalories} Calories
            </h2>
          </div>
        </div>
        <div className="nutritionGoalProgress__rightContainer">
          <div className="nutritionGoalProgress__info">
            <h2>
              {carbs} Carbs of {userCarbs}g
            </h2>
            <ProgressBarComponent
              containerWidth={140}
              progress={(carbs / userCarbs) * 100}
              progressColor={
                (carbs < (90 / 100) * userCarbs && "#FFE66D") ||
                (carbs > (90 / 100) * userCarbs &&
                  carbs < (110 / 100) * userCarbs &&
                  "#006D77") ||
                (carbs > (110 / 100) * userCarbs && "#FF0000")
              }
            />
          </div>
          <div className="nutritionGoalProgress__info">
            <h2>
              {fat} Fat of {userFat}g
            </h2>
            <ProgressBarComponent
              containerWidth={140}
              progress={(fat / userFat) * 100}
              progressColor={
                (fat < (90 / 100) * userFat && "#FFE66D") ||
                (fat > (90 / 100) * userFat &&
                  fat < (110 / 100) * userFat &&
                  "#006D77") ||
                (fat > (110 / 100) * userFat && "#FF0000")
              }
            />
          </div>
          <div className="nutritionGoalProgress__info">
            <h2>
              {protein} Protiens of {userProtein}g
            </h2>
            <ProgressBarComponent
              containerWidth={140}
              progress={(protein / userProtein) * 100}
              progressColor={
                (protein < (90 / 100) * userProtein && "#FFE66D") ||
                (protein > (90 / 100) * userProtein &&
                  protein < (110 / 100) * userProtein &&
                  "#006D77") ||
                (protein > (110 / 100) * userProtein && "#FF0000")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionGoalProgress;
