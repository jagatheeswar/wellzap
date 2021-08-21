import React, { useState, useEffect } from "react";
import "./workouts.css";
import { useSelector } from "react-redux";
import WorkoutScreenHeader from "./WorkoutScreenHeader";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { useHistory } from "react-router";
import { Grid } from "@material-ui/core";
import { formatDate } from "../../functions/formatDate";

function AthleteWorkouts() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [workouts, setWorkouts] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState("");
  const [averageWorkoutTime, setAverageWorkoutTime] = useState("");
  const [AthleteWorkouts, setAthleteWorkouts] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const history = useHistory();

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
          // if (doc.data()?.completedWorkouts) {
          //   setCompletedWorkouts(doc.data().completedWorkouts);
          // } else {
          //   setCompletedWorkouts(0);
          // }

          // if (doc.data()?.averageWorkoutTime) {
          //   setAverageWorkoutTime(doc.data().averageWorkoutTime?.toFixed(2));
          // } else {
          //   setAverageWorkoutTime(0);
          // }
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    if (userData) {
      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        //.where("date", "==", formatDate())
        .where("completed", "==", false)
        .limit(3)
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
        .limit(3)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
      db.collection("WorkoutVideo")
        .where("AssignedToId", "array-contains", userData?.id)
        //.where("selectedDays", "array-contains", formatDate())

        //  .orderBy("timestamp")
        .limit(3)
        .get()
        .then((snap) => {
          let data = [];

          snap.docs.forEach((s) => {
            if (s.data().selectedDays.includes(formatDate())) {
              data.push(s.data());
              console.log("ss", s.data());
            }
            setVideoData(data);
          });
        });

      db.collection("AthleteWorkouts")
        .doc(userData?.id)
        //.where("selectedDays", "array-contains", formatDate())
        .collection(formatDate())
        //  .orderBy("timestamp")
        .limit(3)
        .onSnapshot((snapshot) => {
          setAthleteWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, [userData?.id]);
  useEffect(() => {
    console.log(1, workouts);
  }, [workouts]);
  return (
    <div
      style={{ minHeight: "100vh", marginBottom: 50 }}
      className="workouts__home"
    >
      <div className="coachDashboard__leftContainer">
        <WorkoutScreenHeader name="Workouts" />

        <Grid container spacing={2} className="workouts__homeContainer">
          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{ width: "90%", paddingLeft: 20 }}
              className="workoutHeading__row"
            >
              <h1>Upcoming Workouts</h1>
              <div onClick={() => history.push("/view-all-workouts")}>
                View All
              </div>
            </div>
            <div style={{ width: "90%", paddingLeft: 20 }}>
              {workouts.length > 0 ? (
                workouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    workouts={workouts}
                    item={workout}
                    idx={i}
                    type={"non-editable"}
                    workoutName={
                      workout.data?.workoutName
                        ? workout.data?.workoutName
                        : workout.data?.preWorkout?.workoutName
                    }
                  />
                ))
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                  >
                    There are no Upcoming Workouts for now
                  </h5>
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={6} className="workouts__homeRightContainer">
            <h1>Workout History</h1>
            <div style={{ width: "90%" }} className="workoutRecord">
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
            <div style={{ width: "90%" }} className="workoutHeading__row">
              <h1>Past Workouts</h1>
              <div onClick={() => history.push("/view-all-past-workouts")}>
                View All
              </div>
            </div>
            <div style={{ width: "90%" }}>
              {pastWorkouts.length > 0 ? (
                pastWorkouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    workouts={workouts}
                    item={workout}
                    idx={i}
                    type={"non-editable"}
                    completed={true}
                    workoutName={
                      workout.data?.workoutName
                        ? workout.data?.workoutName
                        : workout.data?.preWorkout?.workoutName
                    }
                  />
                ))
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                  >
                    There are no Past Workouts for now
                  </h5>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={6} className="workouts__homeLeftContainer">
            <div
              style={{ width: "90%", marginLeft: 20 }}
              className="workoutHeading__row"
            >
              <h1>Video Workouts</h1>
              <div onClick={() => history.push("/view-all-video-workouts")}>
                View All
              </div>
            </div>

            <div style={{ width: "90%", paddingLeft: 20, height: 90 }}>
              {videoData?.length > 0 ? (
                videoData?.map((video, idx) => (
                  <div style={{}}>
                    {console.log("hh", videoData)}
                    {video?.Video?.map((Id, idx) => (
                      <div class="iframe_container">
                        <iframe
                          style={{ borderRadius: 10 }}
                          src={
                            "https://player.vimeo.com/video/" + `${Id?.videoId}`
                          }
                          width="400px"
                          height="200px"
                          frameborder="0"
                          webkitallowfullscreen
                          mozallowfullscreen
                          allowfullscreen
                        ></iframe>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                  }}
                >
                  <h5 style={{ fontSize: 12, fontWeight: "normal" }}>
                    {" "}
                    There are no assigned videos for now{" "}
                  </h5>
                </div>
              )}
            </div>
          </Grid>

          <Grid item xs={6} className="workouts__homeRightContainer">
            <div style={{ width: "90%" }} className="workoutHeading__row">
              <h1>Your Workouts</h1>
              <div onClick={() => history.push("/my-workouts")}>View All</div>
            </div>
            <div style={{ width: "90%" }}>
              {AthleteWorkouts.length > 0 ? (
                AthleteWorkouts?.map((workout, i) => (
                  <WorkoutCard
                    key={workout.id}
                    workouts={workouts}
                    item={workout}
                    idx={i}
                    type={"non-editable"}
                    completed={true}
                    navigate={"create-workout"}
                  />
                ))
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                  >
                    There are no Upcoming Workouts for now
                  </h5>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default AthleteWorkouts;
