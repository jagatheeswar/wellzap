import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";

function CoachWorkouts() {
  const userData = useSelector(selectUserData);
  const [workouts, setWorkouts] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (userData) {
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where("selectedDates", "array-contains", formatDate())
        .limit(3)
        .onSnapshot((snapshot) => {
          setWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("assignedToId", "==", "")
        // .where("date", "==", formatDate()) // replace with formatDate() for realtime data
        .limit(5)
        .onSnapshot((snapshot) => {
          setSavedWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);

  console.log({ workouts });

  return (
    <div className="workouts__home">
      <div className="coachDashboard__leftContainer">
        <WorkoutScreenHeader name="Workouts" />

        <div className="workouts__homeContainer">
          <div className="workouts__homeLeftContainer">
            <div className="workoutHeading__row">
              <h1>Upcoming Workouts</h1>
              <div onClick={() => history.push("/view-all-workouts")}>
                View All
              </div>
            </div>
            {workouts?.map((workout, i) => (
              <WorkoutCard
                key={workout.id}
                workouts={workouts}
                item={workout}
                idx={i}
                type="non-editable"
              />
            ))}
          </div>
          <div className="workouts__homeRightContainer">
            <div className="workoutHeading__row">
              <h1>Saved Templates</h1>
              <div onClick={() => history.push("/view-all-saved-workouts")}>
                View All
              </div>
            </div>
            {savedWorkouts?.map((workout, i) => (
              <WorkoutCard
                key={workout.id}
                workouts={savedWorkouts}
                item={workout}
                idx={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachWorkouts;
