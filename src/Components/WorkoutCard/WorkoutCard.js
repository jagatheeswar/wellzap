import React from "react";
import "./WorkoutCard.css";

function WorkoutCard({ workout }) {
  return (
    <div className="workoutCard">
      <img
        src="/assets/illustration.jpeg"
        alt=""
        width="110px"
        height="110px"
      />
      <div className="workoutCard__info">
        <h1>{workout?.data?.preWorkout?.workoutName}</h1>
        <div className="workoutCard__macroNutrients">
          <h3>Calories</h3>
          <h3>{workout?.data?.preWorkout?.caloriesBurnEstimate}</h3>
        </div>
        <div className="workoutCard__macroNutrients">
          <h3>Difficulty</h3>
          <h3>{workout?.data?.preWorkout?.workoutDifficulty}</h3>
        </div>
        <div className="workoutCard__macroNutrients">
          <h3>Duration</h3>
          <h3>{workout?.data?.preWorkout?.workoutDuration}</h3>
        </div>
      </div>

      <img className="right__arrow" src="/assets/right__arrow.png" alt="" />
    </div>
  );
}

export default WorkoutCard;
