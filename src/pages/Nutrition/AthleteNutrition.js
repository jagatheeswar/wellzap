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
import { useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import AthleteNutritionCard from "../../Components/NutritionCard/AthleteNutritionCard";

function AthleteNutrition() {
  const history = useHistory();
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
        .where("selectedDays", "array-contains", formatDate())
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
      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
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
          console.log(temp);
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
    <div style={{ minHeight: "99.7vh" }} className="athleteNutrition">
      <NutritionScreenHeader name="Nutrition" />
      <Grid container className="athleteNutrition__homeContainer">
        <Grid item xs={6}>
          <div
            style={{ width: "90%", marginLeft: 10 }}
            className="athleteNutritionHeading__row"
          >
            <h1>Nutrition Tracker</h1>
          </div>
          <div style={{ width: "90%", marginTop: 11, marginLeft: 10 }}>
            <NutritionGoalProgress />
          </div>
          <div style={{ width: "90%", marginLeft: 10 }}>
            <WaterCard date={formatDate()} water={water} setWater={setWater} />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{ width: "90%" }}
            className="athleteNutritionHeading__row"
          >
            <h1>Meal History</h1>
            <div onClick={() => history.push("/view-all-meal-history")}>
              View All
            </div>
          </div>
          <div style={{ width: "90%" }} className="nutrition__list">
            {mealHistory.length > 0 ? (
              mealHistory?.map((food, idx) => (
                <AthleteNutritionCard
                  key={idx}
                  nutrition={mealHistory}
                  food={food}
                  idx={idx}
                  coachMealHistory={coachMealHistory[0]}
                  navigation={"add-meal"}
                />
              ))
            ) : (
              <h5 className="no-upcoming-food-text">
                There are no upcoming meals for now
              </h5>
            )}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{ width: "90%", marginLeft: 20 }}
            className="athleteNutritionHeading__row"
          >
            <h1>Upcoming Meals</h1>
          </div>
          <div
            style={{ width: "90%", marginLeft: 20 }}
            className="nutrition__list"
          >
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
        </Grid>
        <Grid item xs={6}>
          <div
            style={{ width: "90%" }}
            className="athleteNutritionHeading__row"
          >
            <h1>Assigned Meals By Coach</h1>
            <div onClick={() => history.push("/view-all-nutrition")}>
              View All
            </div>
          </div>
          <div style={{ width: "90%" }}>
            {coachMealHistory.length > 0 ? (
              coachMealHistory?.map((food, idx) => (
                <div
                  onClick={() => {
                    history.push({
                      pathname: "/view-nutrition",
                      state: {
                        nutrition: food,
                        type: "view",
                      },
                    });
                  }}
                  key={idx}
                  className="assignByCoach__Card"
                >
                  <div style={{display: 'flex', alignItems: 'center'}}>
                  <img
                    src="/assets/nutrition.jpeg"
                    alt=""
                    width="110px"
                    height="110px"
                    style={{objectFit: 'contain'}}
                  />
                  <div style={{marginLeft: 20}}>
                    <Typography variant="h6" style={{fontSize: 16}}>{food.data.nutrition.nutritionName}</Typography>
                    <div className="assignByCoach__CardInfoDates">
                      {food.data.selectedDays.map((day, i) => (
                        <Typography style={{fontSize: 12}} key={i}>
                          {formatDate1(day)}
                          {i < food.data.selectedDays.length - 1 ? "," : null}
                        </Typography>
                      ))}
                    </div>
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
        </Grid>
      </Grid>
    </div>
  );
}

export default AthleteNutrition;
