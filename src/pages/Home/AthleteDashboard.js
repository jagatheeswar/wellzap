import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import Sleep from "../../Components/Sleep/Sleep";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import AthleteGoals from "./AthleteGoals";
import "./Home.css";

function AthleteDashboard() {
  const userData = useSelector(selectUserData);
  const [sleep, setSleep] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);

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
          <WorkoutCard key={workout.id} workout={workout} />
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
        <NutritionCard />
      </div>
    </div>
  );
}

export default AthleteDashboard;
