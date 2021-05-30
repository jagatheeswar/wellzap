import React from "react";
import { useSelector } from "react-redux";
import { selectUserType } from "../../features/userSlice";

const WorkoutScreenHeader = () => {
  const userType = useSelector(selectUserType);
  return (
    <div className="workoutsHeader">
      <div className="workoutsHeader__info">
        <div className="workoutsHeader__backButton">
          <img src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <h1>Workouts</h1>
      </div>
      {userType === "coach" && (
        <div className="addWorkout__button">
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
          <h5>{userType === "Athlete" ? "ADD WORKOUT" : "CREATE WORKOUT"}</h5>
        </div>
      )}
    </div>
  );
};

export default WorkoutScreenHeader;
