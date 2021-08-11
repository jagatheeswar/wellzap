import React, { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import { selectUserData } from "../../features/userSlice";
import { useSelector } from "react-redux";
// import { formatDate } from "../../functions/formatDate";
import moment from "moment";
import "./AthleteNutrition.css";
import { Typography } from "@material-ui/core";
import DatePicker from "react-datepicker";

function NutritionWeekGoal() {
  const userData = useSelector(selectUserData);
  // const isFocused = useIsFocused();
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [nutrition, setNutrition] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mindate, setmindate] = useState(new Date());

  var today = new Date();

  const min_date = {
    year: 2021,
    month: "05",
    day: 10,
  };
  const max_date = {
    year: today.getFullYear(),
    month:
      today.getMonth().toString().length == 1
        ? "0" + (today.getMonth() + 1).toString()
        : today.getMonth,

    day:
      today.getDate().toString().length == 1
        ? "0" + today.getDate().toString()
        : today.getDate(),
  };
  function formatDate() {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function incr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  useEffect(() => {
    db.collection("Food")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        let data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        data = data.filter((d) => d.user_id === userData?.id && d.entireFood);
        setNutrition(data);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [startDate, endDate]);

  useEffect(() => {
    if (nutrition.length > 0) {
      let tDate = nutrition[0].date;
      let tempCount = 0;
      let tempCal = 0;
      let tempCarbs = 0;
      let tempFat = 0;
      let tempProtein = 0;
      var start = moment(startDate);
      var end = moment(endDate);
      var diff = end.diff(start, "days") + 1;

      for (let i = 0; i < diff; i++) {
        let t1 = nutrition.filter((w) => w.date === tDate);
        t1.map((t) => {
          t.entireFood.map((foodContainer) => {
            foodContainer.food.map((f) => {
              tempCal = tempCal + f.calories;
              tempCarbs = tempCarbs + f.carbs;
              tempFat = tempFat + f.fat;
              tempProtein = tempProtein + f.proteins;
            });
          });
        });

        tDate = incr_date(tDate);
        tempCount = tempCount + 1;
      }

      setCalories((tempCal / tempCount).toFixed(1));
      setCarbs((tempCarbs / tempCount).toFixed(1));
      setFat((tempFat / tempCount).toFixed(1));
      setProtein((tempProtein / tempCount).toFixed(1));
    }
  }, [nutrition]);

  return (
    <div className="weekGoalMain">
      <div className="weekGoalContainer">
        {/* <Typography variant="h6" style={{fontWeight:"normal"}}>Average Macronutrients consumed</Typography> */}
        <div
          style={{
            textAlign: "center",
            marginTop: 15,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DatePicker
            selected={endDate}
            maxDate={new Date()}
            onChange={(date) => setEndDate(date)}
          />
          <span>and</span>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            maxDate={mindate}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "60%",
            }}
          >
            <Typography style={{ alignSelf: "start" }}>
              Average Calories
            </Typography>
            <Typography style={{ alignSelf: "start" }}>
              Average Carbs
            </Typography>
            <Typography style={{ alignSelf: "start" }}>Average Fat</Typography>
            <Typography style={{ alignSelf: "start" }}>
              Average Protein
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "20%",
            }}
          >
            <Typography style={{ alignSelf: "flex-start" }}>
              {calories} kcal
            </Typography>
            <Typography style={{ alignSelf: "flex-start" }}>
              {carbs} grams
            </Typography>
            <Typography style={{ alignSelf: "flex-start" }}>
              {fat} grams
            </Typography>
            <Typography style={{ alignSelf: "flex-start" }}>
              {protein} grams
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionWeekGoal;
