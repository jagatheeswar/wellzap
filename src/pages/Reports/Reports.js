import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../utils/firebase";
import {
  selectTemperoryId,
  selectUserData,
  selectUserType,
} from "../../features/userSlice";
import moment from "moment";
import "./Report.css";
import Dropdown_ from "./Dropdown_";
import Compliance_report from "./Compliance_report";
import { Chart } from "chart.js";
import Graph3_ from "./Graph3";
import { useParams } from "react-router";
import NutritionGoalProgress from "../../Components/NutritionGoalProgress/NutritionGoalProgress";
import { Grid, Typography } from "@material-ui/core";
import NutritionWeekGoal from "../Nutrition/NutritionWeekGoal";
const Reports = (props) => {
  const [chart_data, setchart_data] = useState({});
  const [chart_data2, setchart_data2] = useState({});
  const [chart_data3, setchart_data3] = useState({});
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
  const [iscompliancedata_empty, setiscompliance_empty] = useState(true);

  var Id = props.Id ? props.Id : temperoryId;

  useEffect(() => {
    if (userType) {
      db.collection("athletes")
        .doc(Id ? Id : userData?.id)
        .get()
        .then(function (snap) {
          setAthleteDetails({
            id: Id ? Id : userData?.id,
            data: snap.data(),
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setAthleteDetails(userData);
    }
  }, [userData, Id, temperoryId]);

  useEffect(() => {
    let labels = [];

    var tempDate = currentStartWeek1;
    let tDate = new Date(tempDate);
    labels.push(
      formatSpecificDay(
        formatSpecificDate(
          new Date(tDate.setDate(tDate.getDate())).toUTCString()
        )
      )
    );
    for (var n = 0; n < 6; n = n + 1) {
      let tDate = new Date(tempDate);
      tempDate = formatSpecificDate(
        new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
      );
      let s = formatSpecificDay(tempDate);

      labels.push(s);
    }

    const data1 = {
      labels: labels,
      datasets: [
        {
          data: complianceData,
          backgroundColor: "#fcd549",
          padding: 30,
        },
      ],
    };
    setchart_data2(data1);
  }, [complianceData, currentStartWeek1, currentEndWeek1]);

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
  const data = {
    labels: [30, 31, 1, 2, 3, 7, 5],
    datasets: [
      {
        categoryPercentage: 0.6,
        barPercentage: 1,
        data: [1, 2, 4, 8, 20, 10, 20],
        backgroundColor: "#fcd549",
      },
    ],
  };

  useEffect(() => {
    if (currentStartWeek2 && athleteDetails) {
      var temp = [];
      var tempDate = currentStartWeek2;
      var total = 0;
      var count = 0;
      setiscompliance_empty(true);
      if (athleteDetails?.data?.metrics) {
        while (count < 7) {
          if (athleteDetails?.data?.metrics[tempDate]) {
            if (
              athleteDetails?.data?.metrics[tempDate].water &&
              graph2Options === "water"
            ) {
              total = athleteDetails?.data?.metrics[tempDate].water;
            } else if (
              athleteDetails?.data?.metrics[tempDate].sleep &&
              graph2Options === "sleep"
            ) {
              total = athleteDetails?.data?.metrics[tempDate].sleep;
            } else if (
              athleteDetails?.data?.metrics[tempDate].soreness &&
              graph2Options === "soreness"
            ) {
              if (
                athleteDetails?.data?.metrics[tempDate].soreness &&
                athleteDetails?.data?.metrics[tempDate].soreness === "very-sore"
              ) {
                total = 9;
              } else if (
                athleteDetails?.data?.metrics[tempDate].soreness &&
                athleteDetails?.data?.metrics[tempDate].soreness ===
                  "moderately-sore"
              ) {
                total = 6;
              } else if (athleteDetails?.data?.metrics[tempDate].soreness) {
                total = 3;
              }
            }
          } else {
            total = 0;
          }
          if (total > 0) {
            setiscompliance_empty(false);
          }

          temp.push(total);
          let tDate = new Date(tempDate);

          tempDate = formatSpecificDate(
            new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
          );
          count = count + 1;
          total = 0;
        }
        setGraph2Data(temp);
      } else {
        temp = [];
        total = 0;
        setGraph2Data(temp);
      }
    }
  }, [currentStartWeek2, currentEndWeek2, graph2Options, athleteDetails]);

  useEffect(() => {
    let labels = [];

    var tempDate = currentStartWeek2;
    let tDate = new Date(tempDate);
    labels.push(
      formatSpecificDay(
        formatSpecificDate(
          new Date(tDate.setDate(tDate.getDate())).toUTCString()
        )
      )
    );
    for (var n = 0; n < 6; n = n + 1) {
      let tDate = new Date(tempDate);
      tempDate = formatSpecificDate(
        new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
      );
      let s = formatSpecificDay(tempDate);

      labels.push(s);
    }

    const data1 = {
      labels: labels,

      datasets: [
        {
          borderColor: "red",
          data: graph2Data,
          backgroundColor: "#fcd549",
          padding: 30,
          borderRadius: 5,
        },
      ],
    };
    setchart_data(data1);
  }, [graph2Data]);

  function changeGraph_option(val) {
    setGraph2Options(val);
  }

  const options = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    labels: {
      fontColor: "red",
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          fontColor: "red",
        },
      },
    },
    scales: {
      xAxes: {
        scaleFontSize: 40,
        fontSize: 20,
        grid: {
          display: false,
          color: "rgba(0,0,0,0)",
          lineWidth: 0,
          borderWidth: 0,
        },

        ticks: {
          color: "black",
          display: !iscompliancedata_empty,
          font: {
            size: 14,
          },
          fontSize: 20,
          beginAtZero: true,
        },
        borderWidth: 10,
      },

      yAxes: {
        ticks: {
          display: !iscompliancedata_empty,
          beginAtZero: true,
          min: 0,
          step: 1,
          stepSize: 0.5,
        },

        grid: {
          display: false,
          color: "rgba(0,0,0,0)",
          lineWidth: 0,
          borderWidth: 0,
        },
      },
    },
  };

  function formatDate2(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    month = monthNames[d.getMonth()];
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join(" ");
  }

  function Weekly_report() {
    return <Bar width="350" height="200" data={chart_data} options={options} />;
  }

  const dropdown_options = [
    {
      key: "1",
      text: "Water",
      value: "water",
    },
    {
      key: "2",
      text: "Sleep",
      value: "sleep",
    },
    {
      key: "3",
      text: "Soreness",
      value: "soreness",
    },
  ];
  return (
    <Grid
      style={{ marginLeft: props.showOthers === false ? 0 : 10 }}
      container
      spacing={2}
      className="reports__container"
    >
      <Grid item xs={6}>
        <h1 style={{ fontSize: 19, fontWeight: "600" }}>Compliance</h1>
        {<Compliance_report Id={Id ? Id : userData?.id} height={200} />}
      </Grid>
      <Grid item xs={6} className="chart_container">
        <div>
          <h1 style={{ fontSize: 19, fontWeight: "600", marginBottom: 20 }}>
            Stats
          </h1>
          <div className="chart_">
            {iscompliancedata_empty && (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  transform: "translateX(40%)",
                  top: 220,
                }}
              >
                No data available to show
              </div>
            )}
            <div
              className="chart_legend"
              style={{
                color: "#808080",
                display: "flex",
                fontSize: 20,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              Weekly Report
              <div
                className="dropdown_"
                style={{ fontSize: 20, fontFamily: "Montserrat" }}
              >
                <Dropdown_
                  change_graph={changeGraph_option}
                  options={dropdown_options}
                />
              </div>
            </div>

            <div className="chart_header">
              <img
                onClick={() => {
                  var curr = new Date(currentStartWeek2); // get current date
                  var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

                  var firstday = new Date(curr.setDate(first)).toUTCString();
                  var lastday = new Date(
                    curr.setDate(curr.getDate() + 6)
                  ).toUTCString();

                  setCurrentStartWeek2(formatSpecificDate(firstday));
                  setCurrentEndWeek2(formatSpecificDate(lastday));
                }}
                className="left_arrow"
                width={10}
                alt="legend"
                style={{ marginRight: "auto" }}
                src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
              />
              <div
                className="chart_legend"
                style={{ color: "#808080", fontSize: 14 }}
              >
                {formatDate2(currentStartWeek2)} -{" "}
                {formatDate2(currentEndWeek2)}
              </div>
              <img
                onClick={() => {
                  var curr = new Date(currentStartWeek2); // get current date
                  var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

                  var firstday = new Date(curr.setDate(first)).toUTCString();
                  var lastday = new Date(
                    curr.setDate(curr.getDate() + 6)
                  ).toUTCString();
                  if (!(moment(firstday).valueOf() > moment().valueOf())) {
                    setCurrentStartWeek2(formatSpecificDate(firstday));
                    setCurrentEndWeek2(formatSpecificDate(lastday));
                  }
                }}
                className="right_arrow"
                width={10}
                alt="legend"
                src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
                style={{ transform: "rotate(180deg)", marginLeft: "auto" }}
              />
            </div>

            <div className="chart_bar" style={{ marginTop: 80 }}>
              {Weekly_report()}
            </div>
          </div>
        </div>
      </Grid>
      {props.showOthers === false ? (
        <></>
      ) : (
        <>
          <Grid item xs={6}>
            <h1 style={{ fontSize: 19, fontWeight: "600" }}>Body Stats</h1>
            <Graph3_ Id={Id} />
          </Grid>
          <Grid item xs={6}>
            {/* <NutritionGoalProgress /> */}
            <h1 style={{ fontSize: 19, fontWeight: "600" }}>
              Average Macronutrients consumed
            </h1>
            <NutritionWeekGoal />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Reports;
