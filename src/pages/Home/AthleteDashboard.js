import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import Sleep from "../../Components/Sleep/Sleep";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import { formatDate } from "../../functions/formatDate";
import formatSpecificDate from "../../functions/formatSpecificDate";

import AthleteGoals from "./AthleteGoals";
import "./Home.css";
import { useHistory } from "react-router-dom";
import { Grid } from "@material-ui/core";
import "../../fonts/Open_Sans/OpenSans-Regular.ttf";
import NutritionGoalProgress from "../../Components/NutritionGoalProgress/NutritionGoalProgress";
import WaterCard from "../../Components/WaterCard/WaterCard";

function AthleteDashboard(props) {
  const userData = useSelector(selectUserData);
  const userType = useSelector(selectUserType);
  const [sleep, setSleep] = useState(0);
  const history = useHistory();
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [water, setWater] = useState(0);
  const [upcomingMealHistory, setUpcomingMealHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [coachMealHistory, setCoachMealHistory] = useState([]);
  const [coachName, setCoachName] = useState("");

  useEffect(() => {
    if (userData?.data?.metrics) {
      if (userData?.data?.metrics[formatDate()]) {
        if (userData?.data?.metrics[formatDate()]?.water) {
          setWater(userData?.data?.metrics[formatDate()]?.water);
        }
      }
    }
  }, [userData?.data?.metrics]);

  useEffect(() => {
    let temp = [];
    if (userData?.id) {
      db.collection("Food")
        .where("assignedTo_id", "==", userData?.id)
        .where(
          "selectedDays",
          "array-contains",
          formatSpecificDate("2021-05-18")
        )
        .get()
        .then((snapshot) => {
          setUpcomingMealHistory(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
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
    let temp = [];

    if (userData?.id) {
      db.collection("AthleteNutrition")
        .doc(userData?.id)
        .collection("nutrition")
        .limit(3)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().entireFood) {
              let tempCal = 0;
              let tempCarbs = 0;
              let tempFat = 0;
              let tempProtein = 0;
              //setEntireFood(doc.data().entireFood);
              doc.data().entireFood.map((foodContainer) => {
                foodContainer.food.map((f) => {
                  tempCal = tempCal + f.calories;
                  tempCarbs = tempCarbs + f.carbs;
                  tempFat = tempFat + f.fat;
                  tempProtein = tempProtein + f.proteins;
                });
              });
              let t = { ...doc.data() };
              t.calories = tempCal;
              t.carbs = tempCarbs;
              t.fat = tempFat;
              t.proteins = tempProtein;
              temp.push({ id: doc.id, data: t });
            }
          });
          setMealHistory(temp);
        });
    }
  }, [userData?.id]);

  useEffect(() => {
    let temp = [];
    if (userData?.id) {
      db.collection("Food")
        .where("assignedTo_id", "==", userData.id)
        .limit(3)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.data().nutrition) {
              temp.push({ id: doc.id, data: doc.data() });
            }
          });
          setCoachMealHistory(temp);
        });
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      db.collection("workouts")
        .where("assignedToId", "==", userData?.id)
        .where(
          "date",
          "==",
          formatDate1(props?.selectedDate && props?.selectedDate)
        )
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

      db.collection("Food")
        .where("assignedTo_id", "==", userData.id)
        .where("selectedDays", "array-contains", "2021-05-20")
        .get()
        .then((snapshot) => {
          setNutrition(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [userData]);

  useEffect(() => {
    db.collection("coaches")
      .doc(userData?.data?.listOfCoaches[0])
      .get()
      .then(function (snap) {
        setCoachName(snap.data()?.name);
      });
  }, []);

  console.log({ workouts, nutrition, userData });

  return (
    <div className="coachDashboard__container">
      <h1 style={{ fontSize: 23, fontFamily: "Open_Sans" }}>Dashboard</h1>
      <Grid container spacing={2}>
        <Grid item xs={6} className="coachDashboard__leftContainer">
          <div style={{ width: "90%" }}>
            <h2 style={{ fontSize: 19, fontWeight: "500" }}>Goals</h2>
            <AthleteGoals />
          </div>
        </Grid>
        <Grid item xs={6} className="coachDashboard__rightContainer">
          <div style={{ width: "90%" }}>
            <h2 style={{ fontSize: 19, fontWeight: "500" }}>Coach</h2>
            <div className="athletes__card">
              <div className="athletes__cardInfo">
                <img
                  src={userData?.data.imageUrl}
                  alt=""
                  width="40px"
                  height="40px"
                />
                <h4 style={{ fontFamily: "Montserrat" }}>{coachName}</h4>
              </div>

              <img
                onClick={() => history.push("/messaging")}
                src="/assets/message.png"
                alt=""
                width="15px"
                height="15px"
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ width: "100%" }}>
            <h2 style={{ fontSize: 19, fontWeight: "500" }}>Sleep</h2>
            <Sleep date={formatDate1(props?.selectedDate)} />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div style={{ width: "93%" }}>
            <h2 style={{ fontSize: 19, fontWeight: "500" }}>Nutrition</h2>
            <NutritionGoalProgress />
          </div>
          <div style={{ width: "93%" }}>
            <WaterCard date={formatDate()} water={water} setWater={setWater} />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "90%",
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
              style={{ fontFamily: "Montserrat", cursor: "pointer" }}
            >
              See all
            </p>
          </div>
          {workouts.length > 0 ? (
            workouts?.map((workout, i) => (
              <WorkoutCard
                key={workout.id}
                workouts={workout}
                item={workout}
                idx={i}
              />
            ))
          ) : (
            <div
              style={{
                backgroundColor: "#fff",
                width: "90%",
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
                There are no Workouts for now
              </h5>
            </div>
          )}
        </Grid>
        <Grid item xs={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "93%",
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
              style={{
                marginLeft: 10,
                fontFamily: "Montserrat",
                cursor: "pointer",
              }}
            >
              See all
            </p>
          </div>
          {console.log(nutrition)}
          <div style={{ width: "93%" }}>
            {upcomingMealHistory.length > 0 ? (
              upcomingMealHistory?.map((food, idx) => (
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
                  }}
                >
                  There are no nutrition for now
                </h5>
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AthleteDashboard;
