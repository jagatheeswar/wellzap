import React from "react";
import { useSelector } from "react-redux";
import { selectUserType } from "../../features/userSlice";

function CoachWorkouts() {
  const userType = useSelector(selectUserType);

  return (
    <div>
      <h1>Coach Workouts</h1>
    </div>
  );
}

export default CoachWorkouts;
