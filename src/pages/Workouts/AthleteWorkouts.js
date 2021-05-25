import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { selectUserType } from "../../features/userSlice";

function AthleteWorkouts() {
  const userType = useSelector(selectUserType);

  return (
    <div className="workouts__home">
      <div className="coachDashboard__leftContainer">
        <h1>Athlete Workouts</h1>
      </div>
    </div>
  );
}

export default AthleteWorkouts;
