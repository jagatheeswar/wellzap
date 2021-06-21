import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import Sleep from "../../Components/Sleep/Sleep";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { formatDate } from "../../functions/formatDate";
import formatSpecificDate from "../../functions/formatSpecificDate";

import AthleteGoals from "./AthleteGoals";
import "./Home.css";

function AthleteDashboard() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [sleep, setSleep] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [water, setWater] = useState(0);
  const [upcomingMealHistory, setUpcomingMealHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [coachMealHistory, setCoachMealHistory] = useState([]);

  useEffect(() => {
    if (userData?.data?.metrics) {
      if (userData?.data?.metrics[formatDate()]) {
        if (userData?.data?.metrics[formatDate()]?.water) {
          setWater(userData?.data?.metrics[formatDate()]?.water);
        }
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

  useEffect(() => {
    if (userData) {
      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where("date", "==", "2021-05-21")
        .where("completed", "==", false)
        .limit(3)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("Food")
        .where("assignedTo_id", "==", userData.id)
        .where("selectedDays", "array-contains", "2021-05-20")
        .get()
        .then((snapshot) => {
          setNutrition(
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
  }, [userData]);

  console.log({ workouts, nutrition, userData });

  return (
    <div className="coachDashboard__container">
      <div className="coachDashboard__leftContainer">
        <h1>Dashboard</h1>
        <h2>Goals</h2>
        <AthleteGoals />
        <h2>Sleep</h2>
        <Sleep sleep={sleep} setSleep={setSleep} />
        <h2>Workouts</h2>
        {workouts?.map((workout, i) => (
          <WorkoutCard
            key={workout.id}
            workouts={workout}
            item={workout}
            idx={i}
          />
        ))}
      </div>
      <div className="coachDashboard__rightContainer">
        <h2>Coach</h2>
        <div className="athletes__card">
          <div className="athletes__cardInfo">
            <img
              src={userData?.data.imageUrl}
              alt=""
              width="40px"
              height="40px"
            />
            <h4>{userData?.data.name}</h4>
          </div>

          <img src="/assets/message.png" alt="" width="15px" height="15px" />
        </div>

        <h2>Nutrition Plans</h2>
        {console.log(nutrition)}
        {upcomingMealHistory.length > 0 ? (
          upcomingMealHistory?.map((food, idx) => (
            <NutritionCard
              key={idx}
              nutrition={nutrition}
              food={food}
              idx={idx}
              navigation={"ViewAllNutrition"}
              type="view"
            />
          ))
        ) : (
          <h5
            style={{
              fontSize: "12px",
              backgroundColor: "#fff",
              width: "100%",
              paddingTop: "10px",
              paddingRight: "10px",
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            There are no nutrition for now
          </h5>
        )}
      </div>
    </div>
  );
}

export default AthleteDashboard;
