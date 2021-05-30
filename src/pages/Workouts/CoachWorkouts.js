import React from "react";
import { useSelector } from "react-redux";
import { selectUserType } from "../../features/userSlice";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

function CoachWorkouts() {
  const userType = useSelector(selectUserType);

  return (
    <div className="coachWorkouts">
      <WorkoutScreenHeader />
    </div>
  );
}

export default CoachWorkouts;
