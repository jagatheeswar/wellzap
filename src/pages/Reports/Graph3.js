import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bar, Line } from "react-chartjs-2";
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
        beginAtZero: true,
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

const Graph3_ = () => {
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
  const [bar_colors, setbar_colors] = useState([]);
  useEffect(() => {
    if (userData) {
      if (userType === "coach") {
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
              compliance.push(2);
            } else if (total == 6) {
              bar_color.push("#d3d3d3");
              compliance.push(2);
            } else if (total == 5) {
              bar_color.push("red");
              compliance.push(2);
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

  function decr_date(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10), // year
      parseInt(parts[1], 10) - 1, // month (starts with 0)
      parseInt(parts[2], 10) // date
    );
    dt.setDate(dt.getDate() - 1);
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
    if (currentStartWeek && athleteDetails) {
      var temp1 = [];
      var temp2 = [];
      var temp3 = [];
      var tempDate = currentStartWeek.split("-").reverse().join("-");
      var weight = 0;
      var fat = 0;
      var muscle = 0;
      var count = 0;
      var start = moment(currentStartWeek.split("-").reverse().join("-"));
      var end = moment(currentEndWeek.split("-").reverse().join("-"));
      var diff = end.diff(start, "days") + 1;

      console.log("Inside weight graph useEffect");
      console.log("Second one");
      console.log(graph3Options);
      console.log("Tthird one");
      if (athleteDetails?.data?.metrics) {
        console.log(athleteDetails.data);
        if (graph3Options === "weight") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data.metrics[tempDate].weight) {
                weight = athleteDetails?.data?.metrics[tempDate].weight;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                while (!val) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].weight
                  ) {
                    val = athleteDetails?.data.metrics[tDate].weight;
                  }
                  tDate = decr_date(tDate);
                }
                weight = val;
              }
            } else {
              let val = 0;
              let tDate = decr_date(tempDate);
              while (!val) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].weight
                ) {
                  val = athleteDetails?.data.metrics[tDate].weight;
                }
                tDate = decr_date(tDate);
              }
              weight = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
          }
        } else if (graph3Options === "fat") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].fat) {
                fat = athleteDetails?.data?.metrics[tempDate].fat;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                while (!val) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].fat
                  ) {
                    val = athleteDetails?.data.metrics[tDate].fat;
                  }
                  tDate = decr_date(tDate);
                }
                fat = val;
              }
            } else {
              let val = 0;
              let tDate = decr_date(tempDate);
              while (!val) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].fat
                ) {
                  val = athleteDetails?.data.metrics[tDate].fat;
                }
                tDate = decr_date(tDate);
              }
              fat = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
          }
        } else if (graph3Options === "muscle") {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data?.metrics[tempDate].muscle) {
                muscle = athleteDetails?.data?.metrics[tempDate].muscle;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                while (!val) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].muscle
                  ) {
                    val = athleteDetails?.data.metrics[tDate].muscle;
                  }
                  tDate = decr_date(tDate);
                }
                muscle = val;
              }
            } else {
              let val = 0;
              let tDate = decr_date(tempDate);
              while (!val) {
                if (
                  athleteDetails?.data?.metrics[tDate] &&
                  athleteDetails?.data.metrics[tDate].muscle
                ) {
                  val = athleteDetails?.data.metrics[tDate].muscle;
                }
                tDate = decr_date(tDate);
              }
              muscle = val;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
          }
        } else {
          while (count <= diff) {
            if (athleteDetails?.data?.metrics[tempDate]) {
              if (athleteDetails?.data.metrics[tempDate].weight) {
                weight = athleteDetails?.data?.metrics[tempDate].weight;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                while (!val) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].weight
                  ) {
                    val = athleteDetails?.data.metrics[tDate].weight;
                  }
                  tDate = decr_date(tDate);
                }
                weight = val;
              }
              if (athleteDetails?.data?.metrics[tempDate].fat) {
                fat = athleteDetails?.data?.metrics[tempDate].fat;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                while (!val) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].fat
                  ) {
                    val = athleteDetails?.data.metrics[tDate].fat;
                  }
                  tDate = decr_date(tDate);
                }
                fat = val;
              }
              if (athleteDetails?.data?.metrics[tempDate].muscle) {
                muscle = athleteDetails?.data?.metrics[tempDate].muscle;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                while (!val) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].muscle
                  ) {
                    val = athleteDetails?.data.metrics[tDate].muscle;
                  }
                  tDate = decr_date(tDate);
                }
                muscle = val;
              }
            } else {
              let val1 = 0;
              let val2 = 0;
              let val3 = 0;
              let tDate1 = decr_date(tempDate);
              let tDate2 = decr_date(tempDate);
              let tDate3 = decr_date(tempDate);
              while (!val1) {
                if (
                  athleteDetails?.data.metrics[tDate1] &&
                  athleteDetails?.data.metrics[tDate1].weight
                ) {
                  val1 = athleteDetails?.data.metrics[tDate1].weight;
                }
                tDate1 = decr_date(tDate1);
              }
              while (!val2) {
                if (
                  athleteDetails?.data.metrics[tDate2] &&
                  athleteDetails?.data.metrics[tDate2].fat
                ) {
                  val2 = athleteDetails?.data.metrics[tDate2].fat;
                }
                tDate2 = decr_date(tDate2);
              }
              while (!val3) {
                if (
                  athleteDetails?.data.metrics[tDate3] &&
                  athleteDetails?.data.metrics[tDate3].muscle
                ) {
                  val3 = athleteDetails?.data.metrics[tDate3].muscle;
                }
                tDate3 = decr_date(tDate3);
              }
              weight = val1;
              fat = val2;
              muscle = val3;
            }
            temp1.push(weight);
            temp2.push(fat);
            temp3.push(muscle);
            //console.log({ temp1 });
            tempDate = incr_date(tempDate);
            count = count + 1;
            weight = 0;
            fat = 0;
            muscle = 0;
          }
        }
        setGraph3Data1(temp1);
        setGraph3Data2(temp2);
        setGraph3Data3(temp3);
      } else {
        temp1 = [];
        temp2 = [];
        temp3 = [];
        setGraph3Data1(temp1);
        setGraph3Data2(temp2);
        setGraph3Data3(temp3);
      }
    }
  }, [currentStartWeek, currentEndWeek, graph3Options, athleteDetails]);

  useEffect(() => {
    let labels = [];

    var tempDate = currentStartWeek;
    let tDate = new Date(tempDate);
    labels.push(
      formatSpecificDay(
        formatSpecificDate(
          new Date(tDate.setDate(tDate.getDate())).toUTCString()
        )
      )
    );
    for (var n = 0; n < graph3Data1.length; n = n + 1) {
      let tDate = new Date(tempDate);
      tempDate = formatSpecificDate(
        new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
      );
      let s = formatSpecificDay(tempDate);

      labels.push(s);
    }
    console.log(graph3Data1, graph3Data3);

    const data1 = {
      labels: labels,
      datasets: [
        { label: "1", data: graph3Data1, borderColor: "#fcd54a" },
        {
          label: "2",
          data: graph3Data2,
          borderColor: "#3d3d3d",
        },
        {
          label: "3",
          data: graph3Data3,
          borderColor: "#d3d3d3",
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
    setGraph3Options(val);
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

  const dropdown_options = [
    {
      key: "1",
      text: "weight",
      value: "weight",
    },
    {
      key: "2",
      text: "fat",
      value: "fat",
    },
    {
      key: "3",
      text: "muscle",
      value: "muscle",
    },
  ];
  function labels() {
    let datasets = chart_data2.datasets;
    let data = [
      {
        label: "Fat",
        color: "#fcd54a",
      },
      {
        label: "Muscle",
        color: "#fcd54a",
      },
      {
        label: "Weight",
        color: "#d3d3d3",
      },
    ];
    if (data) {
      let stack_label = Object.keys(data).map((item) => {
        console.log(data[item]);
        return (
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {" "}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
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
      return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            , {stack_label}
          </ul>
        </div>
      );
    }
  }

  return (
    <div className="chart_">
      <div
        className="chart_legend"
        style={{ color: "#808080", fontSize: 20, margin: 20 }}
      >
        Weekly Report
      </div>
      {/* <div className="dropdown_" style={{ padding: 20 }}>
        <Dropdown_
          change_graph={changeGraph_option}
          options={dropdown_options}
        />
      </div> */}

      <div className="chart_header">
        <img
          onClick={() => {
            var curr = new Date(currentStartWeek); // get current date
            var first = curr.getDate() - curr.getDay() - 30; // First day is the  day of the month - the day of the week \

            var firstday = new Date(curr.setDate(first)).toUTCString();
            console.log(firstday, first);
            var lastday = new Date(
              curr.setDate(curr.getDate() + 6)
            ).toUTCString();

            setCurrentStartWeek(formatSpecificDate(firstday));
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
          {
            (console.log(currentStartWeek),
            console.log(formatDate2(currentStartWeek)))
          }
          {formatDate2(currentStartWeek)} - {formatDate2(currentEndWeek)}
        </div>
        <img
          onClick={() => {
            var curr = new Date(currentStartWeek); // get current date
            var first = curr.getDate() - curr.getDay() + 7; // First day is the  day of the month - the day of the week \

            var firstday = new Date(curr.setDate(first)).toUTCString();
            var lastday = new Date(
              curr.setDate(curr.getDate() + 6)
            ).toUTCString();
            if (!(moment(firstday).valueOf() > moment().valueOf())) {
              setCurrentStartWeek(formatSpecificDate(firstday));
              setCurrentEndWeek(formatSpecificDate(lastday));
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
        <Line width="350" height="300" data={chart_data2} options={options} />
      </div>
    </div>
  );
};

export default Graph3_;
