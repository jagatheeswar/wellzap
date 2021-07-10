import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import { Grid } from "@material-ui/core";
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
    <div style={{ minHeight: "99vh" }} className="workouts__home">
      <div className="coachDashboard__leftContainer">
        <WorkoutScreenHeader name="Workouts" />

        <Grid container spacing={2} className="workouts__homeContainer">
          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{
                width: "90%",
                paddingLeft: 10,
                display: "flex",
                alignItems: "center",
              }}
              className="workoutHeading__row"
            >
              <h1>Assigned Workouts</h1>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/view-all-workouts")}
              >
                View All
              </p>
            </div>
            <div style={{ width: "90%" }}>
              {workouts.length > 0 ? (
                workouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    workouts={workouts}
                    item={workout}
                    idx={i}
                    type="non-editable"
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",
                    width: "90%",
                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    marginLeft: 10,
                  }}
                >
                  <h5> There are no assigned workouts for now </h5>
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={6} className="workouts__homeRightContainer">
            <div
              style={{ width: "90%", display: "flex", alignItems: "center" }}
              className="workoutHeading__row"
            >
              <h1>Saved Templates</h1>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/view-all-saved-workouts")}
              >
                View All
              </p>
            </div>
            <div style={{ width: "90%" }}>
              {workouts.length > 0 ? (
                savedWorkouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    workouts={savedWorkouts}
                    item={workout}
                    idx={i}
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",
                    width: "90%",
                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                  }}
                >
                  <h5> There are no saved workouts for now </h5>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default CoachWorkouts;
