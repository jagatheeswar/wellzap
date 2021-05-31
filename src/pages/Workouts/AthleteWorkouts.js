import React, { useState, useEffect } from "react";
import "./workouts.css";
import { useSelector } from "react-redux";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";

function AthleteWorkouts() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState("");
  const [averageWorkoutTime, setAverageWorkoutTime] = useState("");

  useEffect(() => {
    if (userData?.id && userType === "athlete") {
      db.collection("athletes")
        .doc(userData?.id)
        .onSnapshot((doc) => {
          setCompletedWorkouts(
            doc.data().completedWorkouts ? doc.data().completedWorkouts : 0
          );
          setAverageWorkoutTime(
            doc.data().averageWorkoutTime
              ? doc.data().averageWorkoutTime?.toFixed(2)
              : 0
          );
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    if (userData) {
      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        //.where("date", "==", formatDate())
        .where("completed", "==", false)
        .limit(4)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where("completed", "==", true)
        .limit(4)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);

  return (
    <div className="workouts__home">
      <div className="coachDashboard__leftContainer">
        <WorkoutScreenHeader />

        <div className="workouts__homeContainer">
          <div className="workouts__homeLeftContainer">
            <div className="workoutHeading__row">
              <h1>Upcoming Workouts</h1>
              <div>View All</div>
            </div>
            {workouts?.map((workout, i) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
          <div className="workouts__homeRightContainer">
            <h1>Workout History</h1>
            <div className="workoutRecord">
              <div className="workoutRecord__info">
                <h5>{completedWorkouts}</h5>
                <h6>Completed Workouts</h6>
              </div>
              <div className="workoutRecord__info">
                <h5>{averageWorkoutTime} min</h5>
                <h6>Average Workout</h6>
              </div>
              <div className="workoutRecord__info">
                <h5>0</h5>
                <h6>Goals Met</h6>
              </div>
            </div>
            <div className="workoutHeading__row">
              <h1>Past Workouts</h1>
              <div>View All</div>
            </div>
            {pastWorkouts?.map((workout, i) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AthleteWorkouts;
