import React from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import NutritionScreenHeader from "./NutritionScreenHeader";
import "./AthleteNutrition.css";
import AthleteNutritionCard from "../../Components/NutritionCard/AthleteNutritionCard";

function AthleteMealHistory() {
  const userData = useSelector(selectUserData);
  const [mealHistory, setMealHistory] = React.useState([]);

  React.useEffect(() => {
    let temp = [];

    if (userData?.id) {
      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .orderBy("date", "desc")

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

  return (
    <div style={{ minHeight: "99.7vh" }}>
      <NutritionScreenHeader name="Meal History" />
      <div style={{ width: "50%", marginLeft: 20 }}>
        {mealHistory.length > 0 ? (
          mealHistory?.map((food, idx) => (
            <AthleteNutritionCard
              key={idx}
              nutrition={mealHistory}
              food={food}
              idx={idx}
              // coachMealHistory={coachMealHistory[0]}
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
  );
}

export default AthleteMealHistory;
