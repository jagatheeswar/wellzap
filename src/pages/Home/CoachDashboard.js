import React from "react";
import { useSelector } from "react-redux";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData } from "../../features/userSlice";
import "./Home.css";

function CoachDashboard() {
  const userData = useSelector(selectUserData);
  return (
    <div className="coachDashboard__container">
      <div className="coachDashboard__leftContainer">
        <h1> Dashboard</h1>
        <h2>Workouts</h2>
        <WorkoutCard />
        <h2>Nutrition Plans</h2>
        <NutritionCard />
      </div>
      <div className="coachDashboard__rightContainer">
        <h2>Messaging</h2>
        <div className="messaging">
          <div className="messaging__component">Open Messages</div>
          <div className="messaging__component">Schedule Video Call</div>
        </div>

        <h2>Athletes</h2>
        <div className="athletes__card">
          <div className="athletes__cardInfo">
            <img
              src={userData?.data?.imageUrl}
              alt={userData?.data.name}
              width="40px"
              height="40px"
            />
            <h4>{userData?.data.name}</h4>
          </div>

          <img src="/assets/message.png" alt="" width="15px" height="15px" />
        </div>
      </div>
    </div>
  );
}

export default CoachDashboard;
