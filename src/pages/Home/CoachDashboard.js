import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { formatDate } from "../../functions/formatDate";
import CoachCreateWorkout from "../Workouts/CoachCreateWorkout";
import CoachWorkouts from "../Workouts/CoachWorkouts";
import "./Home.css";

function CoachDashboard() {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const history = useHistory();
  const [athletes, setAthletes] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  const [nutrition, setNutrition] = React.useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");

  React.useEffect(() => {
    if (userData) {
      if (userType === "athlete") {
        db.collection("Food")

          .where("assignedTo_id", "==", userData)
          .where("saved", "==", false)
          .onSnapshot((snapshot) => {
            if (snapshot) {
              setNutrition(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
                }))
              );
            }
          });
      } else {
        if (athleteId) {
          db.collection("Food")
            .where("from_id", "==", userData?.id)
            .where("assignedTo_id", "==", athleteId)
            .where("saved", "==", false)
            .onSnapshot((snapshot) => {
              if (snapshot) {
                setNutrition(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              }
            });
        } else {
          db.collection("Food")
            .where("from_id", "==", userData?.id)
            .where("saved", "==", false)
            .onSnapshot((snapshot) => {
              if (snapshot) {
                setNutrition(
                  snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                  }))
                );
              }
            });
        }
      }
    }
  }, [userData?.id, athleteId]);

  const [display_count, setdisplay_count] = useState(3);
  useEffect(() => {
    if (userData?.id) {
      const data = [];
      db.collection("athletes")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((athlete) => {
            if (userData?.data.listOfAthletes?.includes(athlete.id)) {
              let currentID = athlete.id;
              let appObj = { ...athlete.data(), ["id"]: currentID };
              data.push(appObj);
            }
          });
          setAthletes(data);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    if (userData) {
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where("selectedDates", "array-contains", formatDate())
        .limit(3)
        .onSnapshot((snapshot) => {
          console.log(workout);
          setWorkout(
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

  return (
    <div className="coachDashboard__container">
      <div className="coachDashboard__leftContainer">
        <h1> Dashboard</h1>
        <h2>Workouts</h2>
        {savedWorkouts.length > 1
          ? savedWorkouts
              .slice(0, 1)
              .map((work, i) => (
                <WorkoutCard
                  key={workout.id}
                  workouts={savedWorkouts}
                  item={work}
                  idx={i}
                  type="non-editable"
                />
              ))
          : savedWorkouts.map((work, i) => (
              <WorkoutCard
                key={workout.id}
                workouts={savedWorkouts}
                item={work}
                idx={i}
                type="non-editable"
              />
            ))}
        {console.log("nut", nutrition)}
        <h2>Nutrition Plans</h2>
        {nutrition.length > 0 ? (
          nutrition?.map((food, idx) => (
            <NutritionCard
              key={idx}
              nutrition={nutrition}
              food={food}
              idx={idx}
              navigation={"ViewAllNutrition"}
              type="view"
            />
          ))
        ) : (
          <h5
            style={{
              fontSize: "12px",
              backgroundColor: "#fff",
              width: "100%",
              paddingTop: "10px",
              paddingRight: "10px",
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            There are no nutrition for now
          </h5>
        )}
      </div>
      <div className="coachDashboard__rightContainer">
        <h2>Messaging</h2>
        <div className="messaging">
          <div
            className="messaging__component"
            onClick={() => {
              history.push("/messaging");
            }}
          >
            Open Messages
          </div>
          <div
            className="messaging__component"
            onClick={() => {
              history.push("/calendar");
            }}
          >
            Schedule Video Call
          </div>
        </div>

        <h2 style={{ float: "left" }}>Athletes</h2>
        <p
          style={{
            position: "absolute",
          }}
          className="see_more_home"
          onClick={() => {
            history.push("/all-athletes");
          }}
          style={{ textAlign: "right" }}
        >
          {" "}
          See all
        </p>

        {athletes.length > 0 &&
          athletes.slice(0, display_count).map((item) => (
            <div className="athletes__card" style={{ marginTop: 10 }}>
              <div className="athletes__cardInfo">
                {console.log(item.id)}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width="40px"
                  height="40px"
                />
                <h4
                  onClick={() => {
                    history.push("/Athlete/profile/" + `${item.id}`);
                  }}
                >
                  {item.name}
                </h4>
              </div>

              <img
                src="/assets/message.png"
                alt=""
                width="15px"
                height="15px"
              />
            </div>
          ))}
        {display_count < athletes.length ? (
          <p
            className="see_more_home"
            onClick={() => {
              if (display_count + 3 <= athletes.length) {
                setdisplay_count(display_count + 3);
              }
            }}
            style={{ textAlign: "center" }}
          >
            {" "}
            See more
          </p>
        ) : (
          <p
            className="see_more_home"
            onClick={() => {
              setdisplay_count(athletes.length >= 3 ? 3 : athletes.length);
            }}
            style={{ textAlign: "center" }}
          >
            {" "}
            Hide all
          </p>
        )}
      </div>
    </div>
  );
}

export default CoachDashboard;
