import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { selectUserType } from "../../features/userSlice";

const WorkoutScreenHeader = ({ name, navigation }) => {
  const userType = useSelector(selectUserType);
  const history = useHistory();

  return (
    <div className="workoutsHeader">
      <div className="workoutsHeader__info">
        <div className="workoutsHeader__backButton">
          <img src="/assets/left_arrow.png" alt="" width="15px" height="15px" />{" "}
        </div>
        <h1>{name}</h1>
      </div>
      {userType === "coach" && (
        <div
          className="addWorkout__button"
          onClick={() => history.push("create-workout")}
        >
          <img src="/assets/plus_thin.png" alt="" width="15px" height="15px" />
          <h5>CREATE WORKOUT</h5>
        </div>
      )}
    </div>
  );
};

export default WorkoutScreenHeader;
