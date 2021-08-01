import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../utils/firebase";
import { selectUserData, selectTemperoryId } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { Grid } from "@material-ui/core";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import NutritionCard from "../../Components/NutritionCard/NutritionCard";
import { useHistory, useLocation } from "react-router-dom";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { Typography, Avatar } from "@material-ui/core";
import AthleteNutritionCard from "../../Components/NutritionCard/AthleteNutritionCard";

function AthleteHistory(props) {
  const history = useHistory();
  const location = useLocation();
  const [workouts, setWorkouts] = useState([]);
  const [requestDate, setRequestDate] = useState(formatDate());
  const [nutrition, setNutrition] = useState([]);
  const temperoryId = location.state?.id;
  const [mealHistory, setMealHistory] = useState([]);
  const [pastWorkouts, setPastWorkouts] = useState([]);
  const [AthleteWorkouts, setAthleteWorkouts] = React.useState([]);

  // function formatDate() {
  //   var d = new Date(),
  //     month = "" + (d.getMonth() + 1),
  //     day = "" + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2) month = "0" + month;
  //   if (day.length < 2) day = "0" + day;

  //   return [year, month, day].join("-");
  // }

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
    console.log(temperoryId);
    console.log(props?.selectedDate);
    if (temperoryId) {
      var unsub1 = db
        .collection("workouts")
        .where("assignedToId", "==", temperoryId)
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
      console.log(temperoryId);
      var unsub2 = db
        .collection("workouts")
        .where("assignedToId", "==", temperoryId)
        .where(
          "date",
          "==",
          formatDate1(props?.selectedDate && props?.selectedDate)
        )
        .where("completed", "==", true)
        .limit(1)
        .onSnapshot((snapshot) => {
          setPastWorkouts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });

      db.collection("Food")
        .where("assignedTo_id", "==", temperoryId)
        .where(
          "selectedDays",
          "array-contains",
          formatDate1(props?.selectedDate && props?.selectedDate)
        )
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
      var unsub3 = db
        .collection("AthleteWorkouts")
        .doc(temperoryId)
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

      return () => {
        unsub1();
        unsub2();
        unsub3();
      };
    }
  }, [temperoryId]);

  useEffect(() => {
    let temp = [];
    if (temperoryId) {
      db.collection("AthleteNutrition")
        .doc(temperoryId)
        .collection("nutrition")
        // .where("date", "==", formatDate1(props?.selectedDate && props?.selectedDate))
        .doc(formatDate1(props?.selectedDate && props?.selectedDate))
        .get()
        .then((doc) => {
          if (doc.data()?.entireFood) {
            let tempCal = 0;
            let tempCarbs = 0;
            let tempFat = 0;
            let tempProtein = 0;
            //setEntireFood(doc.data()?.entireFood);
            doc.data()?.entireFood.map((foodContainer) => {
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
          setMealHistory(temp);
        });
    }
  }, [temperoryId]);

  return (
    <div style={{ minHeight: "99.7vh" }}>
      <div
        onClick={() => history.goBack()}
        style={{ display: "flex", alignItems: "center", marginTop: 20 }}
      >
        <ArrowBackIosRoundedIcon
          style={{ height: 18, width: 18, padding: 5, cursor: "pointer" }}
        />
        <Typography variant="h6" style={{ fontSize: 25, marginLeft: 5 }}>
          Print Preview
        </Typography>
      </div>
      <Grid container>
        <Grid item xs={6} style={{ paddingLeft: 20 }}>
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
              Workouts
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
            <div style={{ width: "90%" }}>
              {workouts?.map((workout, i) => (
                <WorkoutCard
                  key={workout.id}
                  workouts={workout}
                  item={workout}
                  idx={i}
                />
              ))}
            </div>
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
              Completed Workouts
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
          {pastWorkouts.length > 0 ? (
            <div style={{ width: "90%" }}>
              {pastWorkouts?.map((item, idx) => (
                <WorkoutCard
                  key={idx}
                  workouts={pastWorkouts}
                  item={item}
                  idx={idx}
                  completed={true}
                  type="non-editable"
                />
              ))}
            </div>
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
                There are no completed Workouts for now
              </h5>
            </div>
          )}
        </Grid>
        <Grid item xs={6} style={{ paddingLeft: 20 }}>
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
              Meal History
            </h2>{" "}
            <p
              onClick={() => {
                history.push("/view-all-meal-history");
              }}
              style={{ fontFamily: "Montserrat", cursor: "pointer" }}
            >
              See all
            </p>
          </div>
          {mealHistory.length > 0 ? (
            <div style={{ width: "90%" }}>
              {mealHistory?.map((food, idx) => (
                <AthleteNutritionCard
                  key={idx}
                  nutrition={mealHistory}
                  food={food}
                  idx={idx}
                  type="view"
                  navigation={"add-meal"}
                />
              ))}
            </div>
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
                There are no upcoming meals for now
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
              Today's Diet
            </h2>{" "}
          </div>
          {nutrition.length > 0 ? (
            <div style={{ width: "90%" }}>
              {nutrition?.map((food, idx) => (
                <NutritionCard
                  type="view"
                  key={idx}
                  nutrition={nutrition}
                  food={food}
                  idx={idx}
                />
              ))}
            </div>
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
                There are no assigned nutrition for now
              </h5>
            </div>
          )}
        </Grid>

        <Grid item xs={6} style={{ paddingLeft: 20 }}>
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
              Your Workouts
            </h2>{" "}
            <p
              onClick={() => {
                // history.push("/athlete-workouts");
              }}
              style={{ fontFamily: "Montserrat", cursor: "pointer" }}
            >
              See all
            </p>
          </div>
          {AthleteWorkouts?.length > 0 ? (
            AthleteWorkouts?.map((workout, i) => (
              <WorkoutCard
                key={workout.id}
                workouts={AthleteWorkouts}
                item={workout}
                idx={i}
                type={"non-editable"}
                completed={true}
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
      </Grid>
    </div>
  );
}

export default AthleteHistory;
