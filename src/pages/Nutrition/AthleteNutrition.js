import React, { useEffect, useState } from "react";
import NutritionScreenHeader from "./NutritionScreenHeader";
import "./AthleteNutrition.css";
import NutritionGoalProgress from "../../Components/NutritionGoalProgress/NutritionGoalProgress";
import WaterCard from "../../Components/WaterCard/WaterCard";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import formatSpecificDate from "../../functions/formatSpecificDate";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import formatDate1 from "../../functions/formatDate1";

function AthleteNutrition() {
  const userData = useSelector(selectUserData);
  const [water, setWater] = useState(0);
  const [upcomingMealHistory, setUpcomingMealHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [coachMealHistory, setCoachMealHistory] = useState([]);

  useEffect(() => {
    if (userData?.data?.metrics[formatDate()]) {
      if (userData?.data?.metrics[formatDate()]?.water) {
        setWater(userData?.data?.metrics[formatDate()]?.water);
      }
    }
  }, [userData?.data?.metrics]);

  useEffect(() => {
    let temp = [];
    if (userData?.id) {
      db.collection("Food")
        .where("assignedTo_id", "==", userData?.id)
        .where(
          "selectedDays",
          "array-contains",
          formatSpecificDate("2021-05-18")
        )
        .get()
        .then((snapshot) => {
          setUpcomingMealHistory(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    let temp = [];

    if (userData?.id) {
      db.collection("Food")
        .where("user_id", "==", userData?.id)
        .limit(3)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().entireFood) {
              let tempCal = 0;
              let tempCarbs = 0;
              let tempFat = 0;
              let tempProtein = 0;
              //setEntireFood(doc.data().entireFood);
              doc.data().entireFood.map((foodContainer) => {
                foodContainer.food.map((f) => {
                  tempCal = tempCal + f.calories;
                  tempCarbs = tempCarbs + f.carbs;
                  tempFat = tempFat + f.fat;
                  tempProtein = tempProtein + f.proteins;
                });
              });
              let t = { ...doc.data() };
              t.calories = tempCal;
              t.carbs = tempCarbs;
              t.fat = tempFat;
              t.proteins = tempProtein;
              temp.push({ id: doc.id, data: t });
            }
          });
          setMealHistory(temp);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    let temp = [];
    if (userData?.id) {
      db.collection("Food")
        .where("assignedTo_id", "==", userData.id)
        .limit(3)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().nutrition) {
              temp.push({ id: doc.id, data: doc.data() });
            }
          });
          setCoachMealHistory(temp);
        });
    }
  }, [userData]);

  return (
    <div className="athleteNutrition">
      <NutritionScreenHeader name="Nutrition" />
      <div className="athleteNutrition__homeContainer">
        <div className="athleteNutrition__homeLeftContainer">
          <div className="athleteNutritionHeading__row">
            <h1>Today’s Stats and Goals</h1>
          </div>
          <NutritionGoalProgress />
          <div style={{width: "95%"}}>
          <WaterCard date={formatDate()} water={water} setWater={setWater} />
          </div>
          <div className="athleteNutritionHeading__row">
            <h1>Upcoming Meals</h1>
          </div>
          <div className="nutrition__list">
            {upcomingMealHistory.length > 0 ? (
              upcomingMealHistory?.map((food, idx) => (
                <NutritionCard
                  key={idx}
                  nutrition={upcomingMealHistory}
                  food={food}
                  idx={idx}
                  navigation={"add-meal"}
                />
              ))
            ) : (
              <h5 className="no-upcoming-food-text">
                There are no upcoming meals for now
              </h5>
            )}
          </div>
        </div>
        <div className="athleteNutrition__homeRightContainer">
          <h1>Nutrition Tracker</h1>
          <div className="athleteNutritionHeading__row">
            <h1>Meal History</h1>
          </div>
          <div className="nutrition__list">
            {mealHistory.length > 0 ? (
              mealHistory?.map((food, idx) => (
                <NutritionCard
                  key={idx}
                  nutrition={mealHistory}
                  food={food}
                  idx={idx}
                  navigation={"add-meal"}
                />
              ))
            ) : (
              <h5 className="no-upcoming-food-text">
                There are no upcoming meals for now
              </h5>
            )}
          </div>
          <div className="athleteNutritionHeading__row">
            <h1>Assigned Meals By Coach</h1>
          </div>
          {coachMealHistory.length > 0 ? (
            coachMealHistory?.map((food, idx) => (
              <div key={idx} className="assignByCoach__Card">
                <img
                  src="/assets/nutrition.jpeg"
                  alt=""
                  width="110px"
                  height="110px"
                />

                <div className="assignByCoach__CardInfo">
                  <h4>{food.data.nutrition.nutritionName}</h4>
                  <div className="assignByCoach__CardInfoDates">
                    {food.data.selectedDays.map((day, i) => (
                      <h4 key={i}>
                        {formatDate1(day)}
                        {i < food.data.selectedDays.length - 1 ? "," : null}
                      </h4>
                    ))}
                  </div>
                </div>
                <img
                  className="rightArrow"
                  src="/assets/right__arrow.png"
                  alt=""
                />
              </div>
            ))
          ) : (
            <h5 className="no-upcoming-food-text">
              There are no assigned meals.
            </h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default AthleteNutrition;
