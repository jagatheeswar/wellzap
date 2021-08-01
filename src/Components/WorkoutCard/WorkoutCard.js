import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db } from "../../utils/firebase";
import { selectUserType, selectUserData } from "../../features/userSlice";
import "./WorkoutCard.css";
import { formatDate } from "../../functions/formatDate";

function WorkoutCard({
  workouts,
  idx,
  item,
  showDate,
  type,
  completed,
  athlete_id,
  selectedWeekNum,
  isLongTerm,
  weeks,
  handleCloseworkout,
  setWeeks,
  selectedDay,
  navigate,
}) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [date, setDate] = useState("");
  const [workout, setWorkout] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const history = useHistory();
  const [workoutName, setworkoutName] = useState("");
  const [Weeks, setWeeks_data] = useState([]);
  useEffect(() => {
    if (weeks) {
      let week = weeks[0]?.days;
      let days = Object.keys(weeks[0]?.days);
      weeks &&
        days.forEach((day) => {
          if (week[day] != "") {
            setworkoutName(week[day]?.preWorkout?.workoutName);
          }
        });
    }
  }, [weeks]);

  useEffect(() => {
    if (userData) {
      db.collection("CoachWorkouts")
        .where("assignedById", "==", userData?.id)
        .where("saved", "==", false)
        .where("selectedDates", "array-contains", formatDate())
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
    if (showDate) {
      if (item?.data?.date) {
        setDate(item?.data?.date.split("-").reverse().join("-"));
      }
    }
  }, [type, item]);

  return (
    <div
      className="workoutCard"
      onClick={() => {
        if (isLongTerm) {
          if (navigate) {
            if (navigate) {
              history.push({
                pathname: "/long-term-training",
                state: {
                  workout: workouts,
                  workoutName: item?.data?.preWorkout?.workoutName,
                  weeks: weeks,
                  assignType: type,
                },
              });
            }
          } else {
            var lweeks = weeks;
            var lselectedWeekNum = selectedWeekNum;
            var lselectedDay = selectedDay;
            lweeks[lselectedWeekNum - 1].days[lselectedDay] = item?.data;

            setWeeks_data(lweeks);

            handleCloseworkout();
          }
        } else {
          if (userType === "coach") {
            if (type === "non-editable" && !completed) {
              console.log("clicked 1");
              history.push({
                pathname: "/assign-workout",
                state: {
                  workout: workouts[idx],
                  workoutName: item?.data?.preWorkout?.workoutName,
                  assignType: "non-editable",
                },
              });
            } else if (completed === true) {
              console.log("nak", item);
              history.push({
                pathname: "/post-workout",
                state: {
                  workout: item,
                  workoutName: item?.data?.preWorkout?.workoutName,
                  completed: true,
                },
              });
            } else {
              if (item?.data?.assignedToId) {
                console.log("clicked 3");
                history.push({
                  pathname: "/assign-workout",
                  state: {
                    workout: workouts[idx],
                    workoutName: item?.data?.preWorkout?.workoutName,
                    assignType: "update",
                    athlete_id: athlete_id,
                  },
                });
              } else {
                console.log("clicked 4");
                history.push({
                  pathname: "/assign-workout",
                  state: {
                    workout: workouts[idx],
                    workoutName: item?.data?.preWorkout?.workoutName,
                    assignType: "create",
                  },
                });
              }
            }
          } else {
            console.log("nssjsnji", navigate);
            if (navigate == "create-workout") {
              history.push({
                pathname: "/create-workout",
                state: {
                  workout: item,
                  workoutName: item?.data?.preWorkout?.workoutName,
                  completed: true,
                },
              });
            } else {
              if (completed === true) {
                console.log("nak", item);
                history.push({
                  pathname: "/post-workout",
                  state: {
                    workout: item,
                    workoutName: item?.data?.preWorkout?.workoutName,
                    completed: true,
                  },
                });
              } else {
                console.log("opening past workouts");
                history.push({
                  pathname: "/post-workout",
                  state: {
                    workout: workouts[idx],
                    workoutName: item?.data?.preWorkout?.workoutName,
                    assignType: "view",
                  },
                });
              }
            }
          }
        }
      }}
    >
      <img
        src="/assets/illustration.jpeg"
        alt=""
        width="110px"
        height="110px"
      />
      <div className="workoutCard__info">
        <h1>
          {isLongTerm ? workoutName : item?.data?.preWorkout?.workoutName}
        </h1>
        <div className="workoutCard__macroNutrients">
          <h3>Calories</h3>
          <h3>{item?.data?.preWorkout?.caloriesBurnEstimate}</h3>
        </div>
        <div className="workoutCard__macroNutrients">
          <h3>Difficulty</h3>
          <h3>{item?.data?.preWorkout?.workoutDifficulty}</h3>
        </div>
        <div className="workoutCard__macroNutrients">
          <h3>Duration</h3>
          <h3>{item?.data?.preWorkout?.workoutDuration}</h3>
        </div>
      </div>

      <img className="right__arrow" src="/assets/right__arrow.png" alt="" />
    </div>
  );
}

export default WorkoutCard;
