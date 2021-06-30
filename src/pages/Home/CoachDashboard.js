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

function CoachDashboard(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const history = useHistory();
  const [athletes, setAthletes] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [nutritoin_show, setnutirtion_show] = useState(0);
  const [nutrition, setNutrition] = React.useState([]);
  const [type, setType] = React.useState("");
  const [athleteId, setAthleteId] = React.useState("");
  console.log("coachD", new Date(props.selectedDate));
  console.log("cd", formatDate1(props?.selectedDate && props?.selectedDate));
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
            .where(
              "selectedDays",
              "array-contains",
              formatDate1(props?.selectedDate && props?.selectedDate)
            )
            .limit(3)
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

  function formatDate1(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  useEffect(() => {
    if (userData) {
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where(
          "selectedDates",
          "array-contains",
          formatDate1(props?.selectedDate && props?.selectedDate)
        )
        .limit(3)
        .onSnapshot((snapshot) => {
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

  useEffect(() => {
    if (nutrition.length > 3) {
      setnutirtion_show(3);
    } else {
      setnutirtion_show(nutrition.length);
    }
    {
      console.log(nutrition);
    }
  }, [nutrition]);

  return (
    <div className="coachDashboard__container">
      <div className="coachDashboard__leftContainer">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          <h2
            style={{
              fontSize: 19,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Workout Plans on
            <p
              style={{
                fontSize: 18,
                fontWeight: 400,
                marginLeft: 10,
              }}
            >
              {" "}
              {formatDate1(props?.selectedDate)}
            </p>
          </h2>{" "}
          <p
            onClick={() => {
              history.push("/workouts");
            }}
          >
            See all
          </p>
        </div>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {" "}
          <h2
            style={{
              fontSize: 19,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Nutrition Plans on
            <p
              style={{
                fontSize: 18,
                fontWeight: 400,
                marginLeft: 10,
              }}
            >
              {" "}
              {formatDate1(props?.selectedDate)}
            </p>
          </h2>{" "}
          <p
            onClick={() => {
              history.push("/nutrition");
            }}
          >
            See all
          </p>
        </div>
        {nutrition.length > 0 && props?.selectedDate ? (
          nutrition.map((food, idx) => (
            <NutritionCard
              key={idx}
              nutrition={nutrition}
              food={food}
              idx={idx}
              navigation={"ViewAllNutrition"}
              type="view"
              date={formatDate1(props?.selectedDate)}
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

        {nutrition.length > nutritoin_show ? (
          <p
            onClick={() => {
              setnutirtion_show(nutritoin_show + 3);
            }}
            style={{ textAlign: "center" }}
          >
            {" "}
            View more
          </p>
        ) : (
          <p
            onClick={() => {
              if (nutrition.length < 3) {
                setnutirtion_show(nutrition.length);
              } else {
                setnutirtion_show(3);
              }
            }}
          >
            Hide all
          </p>
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
        {/* {display_count < athletes.length ? (
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
        )} */}
      </div>
    </div>
  );
}

export default CoachDashboard;
