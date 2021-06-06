import { useDispatch, useSelector } from "react-redux";
import {
  selectTemperoryId,
  selectUserData,
  selectUserType,
} from "../../features/userSlice";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bar } from "react-chartjs-2";
import { db } from "../../utils/firebase";
import moment from "moment";
import "moment/locale/en-in";
import Dropdown_ from "./Dropdown_";
import { Chart } from "chart.js";

import "./Report.css";
function Reports() {
  const [chart_data, setchart_data] = useState({});
  const userType = useSelector(selectUserType);

  const userData = useSelector(selectUserData);
  const temperoryId = useSelector(selectTemperoryId);
  const [athleteDetails, setAthleteDetails] = useState(null);

  moment.locale("en-in");
  const [metric, setMetric] = useState("weight");
  const [metricData, setMetricData] = useState([0, 0]);
  const [currentStartWeek, setCurrentStartWeek] = useState(
    moment(new Date()).subtract(30, "days").utc().format("DD-MM-YYYY")
  );
  const [currentEndWeek, setCurrentEndWeek] = useState(
    moment(new Date()).utc().format("DD-MM-YYYY")
  );
  const [currentStartWeek1, setCurrentStartWeek1] = useState(null);
  const [currentEndWeek1, setCurrentEndWeek1] = useState(null);
  const [currentStartWeek2, setCurrentStartWeek2] = useState(null);
  const [currentEndWeek2, setCurrentEndWeek2] = useState(null);
  const [complianceData, setComplianceData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph2Options, setGraph2Options] = useState("water");
  const [graph2Data, setGraph2Data] = useState([]);
  const [graph3Options, setGraph3Options] = useState("all");
  const [graph3Data1, setGraph3Data1] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data2, setGraph3Data2] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [graph3Data3, setGraph3Data3] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (userData) {
      if (userType === "coach") {
        db.collection("athletes")
          .doc(temperoryId)
          .get()
          .then(function (snap) {
            setAthleteDetails({

              id: temperoryId,
              data: snap.data(),
              
            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      } else {
        setAthleteDetails(userData);
      }
    }
  }, [userData, temperoryId]);

  useEffect(() => {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    setCurrentStartWeek1(formatSpecificDate(firstday));
    setCurrentEndWeek1(formatSpecificDate(lastday));
    setCurrentStartWeek2(formatSpecificDate(firstday));
    setCurrentEndWeek2(formatSpecificDate(lastday));
  }, []);

  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function formatSpecificDay(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return day;
  }

  useEffect(() => {
    if (currentStartWeek1 && athleteDetails) {
      var compliance = [];
      var tempDate = currentStartWeek1;
      var total = 0;
      var count = 0;
      console.log("Inside compliance graph useEffect");

      db.collection("workouts")
        .where("assignedToId", "==", athleteDetails?.id)
        .where("date", ">=", currentStartWeek1)
        .where("date", "<=", currentEndWeek1)
        .orderBy("date")
        .get()
        .then((querySnapshot) => {
          while (count < 7) {
            querySnapshot.forEach((doc) => {
              if (doc.data().postWorkout) {
                if (tempDate === doc.data().date && doc.data().compliance) {
                  if (doc.data().compliance === "Non compliant") {
                    total = 2;
                  } else if (doc.data().compliance === "Partially compliant") {
                    total = 6;
                  } else {
                    total = 10;
                  }
                } else {
                  total = 0;
                }
              } else {
                total = 0;
              }
            });
            compliance.push(total);
            let tDate = new Date(tempDate);
            tempDate = formatSpecificDate(
              new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
            );
            count = count + 1;
            total = 0;
          }
          setComplianceData(compliance);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [currentStartWeek1, currentEndWeek1, temperoryId, athleteDetails]);

  const data = {
    type: "bar",
    labels: [30, 31, 1, 2, 3, 4, 5],
    datasets: [
      {
        barThickness: 23,
        barPercentage: 10,
        categoryPercentage: 0.1,
        data: [1, 2, 4, 8, 20, 10, 20],
        backgroundColor: "#fcd549",
      },
    ],
  };
  const data1 = {
    labels: ["first", "second", "third", "4th", "5th", "6th", "7th"],
    datasets: [
      {
        barThickness: 16,
        barPercentage: 0.5,
        data: [1, 22, 4, 8, 10, 10, 20],
        backgroundColor: "#fcd549",
        padding: 30,
      },
    ],
  };

  useEffect(() => {
    setchart_data(data);
  }, []);

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      ticks: {
        display: false,
      },
      gridLines: {
        drawOnChartArea: false,
      },
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Days",
            fontSize: 20,
            color: "red",
          },
          gridLines: {
            drawOnChartArea: false,
            lineWidth: 0,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            drawOnChartArea: false,
          },
        },
      ],
    },
  };
  console.log(Chart);
  return (
    <div className="App">
      <div className="chart_container">
        <div className="chart_">
          <div
            className="chart_legend"
            style={{ color: "#808080", fontSize: 20, marginTop: 10 }}
          >
            Weekly Report
          </div>
          <div className="dropdown_" style={{ padding: 20 }}>
            <Dropdown_ />
          </div>
          <div className="chart_header">
            <img
              onClick={() => {
                setchart_data(data);
              }}
              className="left_arrow"
              width={10}
              alt="legend"
              style={{ marginRight: "auto" }}
              src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
            />
            <div
              className="chart_legend"
              style={{ color: "#808080", fontSize: 17 }}
            >
              30 May 2021-5 June 2021
            </div>
            <img
              onClick={() => {
                setchart_data(data1);
              }}
              className="right_arrow"
              width={10}
              alt="legend"
              src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
              style={{ transform: "rotate(180deg)", marginLeft: "auto" }}
            />
          </div>

          <div className="chart_bar" style={{ marginTop: 20 }}>
            <Bar width="350" height="300" data={chart_data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
