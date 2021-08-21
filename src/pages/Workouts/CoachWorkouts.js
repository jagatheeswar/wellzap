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
  const [savedLongTermWorkouts, setsavedLongTermWorkouts] = useState([]);
  const [LongTermWorkouts, setLongTermWorkouts] = useState([]);
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
        .limit(3)
        .onSnapshot((snapshot) => {
          setSavedWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("longTermWorkout")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where("isLongTerm", "==", true)
        .orderBy("timestamp", "desc")
        // .where("date", "==", formatDate()) // replace with formatDate() for realtime data
        .limit(3)
        .onSnapshot((snapshot) => {
          setLongTermWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      db.collection("longTermWorkout")

        .where("assignedById", "==", userData?.id)
        .where("assignedToId", "==", "")
        .orderBy("timestamp", "desc")

        // .where("date", "==", formatDate()) // replace with formatDate() for realtime data
        .limit(3)
        .onSnapshot((snapshot) => {
          setsavedLongTermWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);

  return (
    <div style={{ minHeight: "99vh" }} className="workouts__home">
      <WorkoutScreenHeader name="Workouts" />

      <div className="coachDashboard__leftContainer" style={{ marginTop: 20 }}>
        <Grid container spacing={2} className="workouts__homeContainer">
          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{ width: "90%", marginLeft: 20 }}
              className="workoutHeading__row"
            >
              <h1>Assigned Workouts</h1>

              <div onClick={() => history.push("/view-all-workouts")}>
                View All
              </div>
            </div>

            <div style={{ width: "90%", marginLeft: 20 }}>
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
                    marginTop: 20,
                    fontSize: "13px",
                    backgroundColor: "#fff",
                    width: "90%",
                    padding: "10px 20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                  }}
                >
                  <h5> There are no assigned workouts for now </h5>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={6} className="workouts__homeRightContainer">
            <div style={{ width: "90%" }} className="workoutHeading__row">
              <h1>Saved Templates</h1>
              <div onClick={() => history.push("/view-all-saved-workouts")}>
                View All
              </div>
            </div>

            <div style={{ width: "90%" }}>
              {savedWorkouts.length > 0 ? (
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
                    marginTop: 20,

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
          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{ width: "90%", marginLeft: 20 }}
              className="workoutHeading__row"
            >
              <h1>Assigned LongTerm Workouts</h1>
              <div onClick={() => history.push("/all-LongTerm-workouts")}>
                View All
              </div>
            </div>
            {console.log(LongTermWorkouts)}

            <div style={{ width: "90%", marginLeft: 20 }}>
              {LongTermWorkouts?.length > 0 ? (
                LongTermWorkouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    workouts={workout.data}
                    weeks={workout.data.weeks}
                    isLongTerm={true}
                    item={workout}
                    idx={i}
                    type="view"
                    navigate={true}
                    workoutName={workout.data?.workoutName}
                  />
                ))
              ) : (
                <div
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fff",
                    width: "90%",
                    padding: "10px 20px",
                    marginTop: 20,

                    textAlign: "center",
                    borderRadius: "5px",
                    fontWeight: "normal",
                  }}
                >
                  <h5> There are no assigned LongTerm workouts for now </h5>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div style={{ width: "90%" }} className="workoutHeading__row">
              <h1>Saved LongTerm Workouts</h1>
              <div onClick={() => history.push("/all-saved-LongTerm-workouts")}>
                View All
              </div>
            </div>

            <div style={{ width: "90%" }}>
              {savedLongTermWorkouts?.length > 0 ? (
                savedLongTermWorkouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    weeks={workout.data.weeks}
                    item={workout}
                    idx={i}
                    selectedWeekNum={workout.data.weeks[0].weeknum}
                    isLongTerm={true}
                    type="edit"
                    navigate={true}
                    workoutName={workout?.data?.workoutName}
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
                    marginTop: 20,
                  }}
                >
                  <h5> There are no saved LongTerm workouts for now </h5>
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
