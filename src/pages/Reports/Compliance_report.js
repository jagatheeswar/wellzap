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
    x: {
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
        font: {
          size: 14,
        },
        fontSize: 20,
        beginAtZero: true,
      },
      borderWidth: 10,
    },

    y: {
      stacked: true,
      ticks: {
        beginAtZero: true,
        min: 0,
        stepSize: 1,
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

const Compliance_report = (props) => {
  const [chart_data, setchart_data] = useState({});
  const [chart_data2, setchart_data2] = useState({});
  const [chart_data3, setchart_data3] = useState({});
  const userType = useSelector(selectUserType);

  var height = props.height ? props.height : 300;
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
  const [bar_colors, setbar_colors] = useState([]);
  useEffect(() => {
    if (userType) {
      if (userType) {
        db.collection("athletes")
          .doc("Zonwno1E5oyZ3sYImBjY")
          .get()
          .then(function (snap) {
            setAthleteDetails({
              id: "Zonwno1E5oyZ3sYImBjY",
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
    if (currentStartWeek1 && athleteDetails) {
      var compliance = [];
      var tempDate = currentStartWeek1;
      var total = 0;
      var count = 0;
      let bar_color = [];
      //console.log("Inside compliance graph useEffect", athleteDetails);

      db.collection("workouts")
        .where("assignedToId", "==", "rrU9qlLHjra0dlUhnpX1")
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
                  } else if (doc.data().compliance === "Fully compliant") {
                    total = 8;
                  } else {
                    total = 5;
                  }
                } else {
                  total = total + 0;
                }
              } else {
                total = total + 0;
              }
            });

            if (total == 2) {
              bar_color.push("#454545");
              compliance.push(1);
            } else if (total == 6) {
              bar_color.push("#d3d3d3");
              compliance.push(1);
            } else if (total == 5) {
              bar_color.push("red");
              compliance.push(1);
            } else if (total == 8) {
              bar_color.push("#fcd54a");
              compliance.push(1);
            } else {
              compliance.push(0);
            }

            let tDate = new Date(tempDate);
            tempDate = formatSpecificDate(
              new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
            );
            count = count + 1;
            total = 0;
          }
          setbar_colors(bar_color);

          setComplianceData(compliance);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [currentStartWeek1, currentEndWeek1, temperoryId, athleteDetails]);

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
          backgroundColor: bar_colors,
          padding: 30,
        },
      ],
    };
    setchart_data2(data1);
  }, [complianceData]);

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
          data: graph2Data,
          backgroundColor: "#fcd549",
          padding: 30,
        },
      ],
    };
    setchart_data(data1);
  }, [graph2Data]);

  function changeGraph_option(val) {
    setGraph2Options(val);
  }

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

  function labels() {
    let datasets = chart_data2.datasets;
    let data = [
      {
        label: "Fully Compliant",
        color: "#fcd54a",
      },
      {
        label: "Partially Compliant",
        color: "#d3d3d3",
      },
    ];
    let data1 = [
      {
        label: "Non Compliant",
        color: "#454545",
      },
      {
        label: "Exceeded",
        color: "red",
      },
    ];

    let stack_label = Object.keys(data).map((item) => {
      return (
        <li
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          {" "}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "red",
              marginRight: 10,

              backgroundColor: data[item]["color"],
            }}
          ></div>
          {data[item]["label"]}
        </li>
      );
    });
    let stack_label1 = Object.keys(data1).map((item) => {
      return (
        <li
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          {" "}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "red",
              marginRight: 10,

              backgroundColor: data1[item]["color"],
            }}
          ></div>
          {data1[item]["label"]}
        </li>
      );
    });

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          paddingInlineStart: 0,
        }}
      >
        <ul
          style={{
            display: "flex",
            flexDirection: "column",

            paddingInlineStart: 0,
          }}
        >
          {stack_label}
        </ul>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            paddingInlineStart: 0,
          }}
        >
          {stack_label1}
        </ul>
      </div>
    );
  }
  return (
    <div className="chart_container">
      <div className="chart_">
        <div
          className="chart_legend"
          style={{ color: "#808080", fontSize: 20, margin: 15 }}
        >
          Compliance Weekly Report
        </div>

        <div className="chart_header">
          <img
            onClick={() => {
              var curr = new Date(currentStartWeek1); // get current date
              var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

              var firstday = new Date(curr.setDate(first)).toUTCString();
              var lastday = new Date(
                curr.setDate(curr.getDate() + 6)
              ).toUTCString();

              setCurrentStartWeek1(formatSpecificDate(firstday));
              setCurrentEndWeek1(formatSpecificDate(lastday));
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
            {formatDate2(currentStartWeek1)} - {formatDate2(currentEndWeek1)}
          </div>
          <img
            onClick={() => {
              var curr = new Date(currentStartWeek1); // get current date
              var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

              var firstday = new Date(curr.setDate(first)).toUTCString();
              var lastday = new Date(
                curr.setDate(curr.getDate() + 6)
              ).toUTCString();
              if (!(moment(firstday).valueOf() > moment().valueOf())) {
                setCurrentStartWeek1(formatSpecificDate(firstday));
                setCurrentEndWeek1(formatSpecificDate(lastday));
              }
            }}
            className="right_arrow"
            width={10}
            alt="legend"
            src="https://cdn0.iconfinder.com/data/icons/glyphpack/26/nav-arrow-left-512.png"
            style={{ transform: "rotate(180deg)", marginLeft: "auto" }}
          />
        </div>
        {labels()}

        <div className="chart_bar" style={{ marginTop: 20 }}>
          <Bar
            width="350"
            height={height}
            data={chart_data2}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default Compliance_report;
