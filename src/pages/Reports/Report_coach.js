import React, { useState, useEffect } from "react";

//import { StackedBarChart } from "react-native-svg-charts";
import { Bar, Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import moment from "moment";
import "./Report.css";
import Dropdown_ from "./Dropdown_";
import Compliance_report from "./Compliance_report";
import { Chart } from "chart.js";
import Graph3_ from "./Graph3";
const options = {
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
      labels: {
        // This more specific font property overrides the global property
        fontColor: "red",
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
        lineWidth: 0,
        borderWidth: 0,
      },

      borderWidth: 10,
    },
    y: {
      stacked: true,
      grid: {
        display: false,
        lineWidth: 0,
        borderWidth: 0,
      },
      ticks: {
        min: 0,
        stepSize: 1,
      },
    },
  },
};
function Report_coach(props) {
  const userData = useSelector(selectUserData);
  var height = props.height ? props.height : 300;
  const [currentStartWeek, setCurrentStartWeek] = React.useState(null);
  const [currentEndWeek, setCurrentEndWeek] = React.useState(null);
  const [workouts, setWorkouts] = React.useState([]);
  const [compliance, setCompliance] = React.useState([]);
  const [complianceCount, setComplianceCount] = React.useState(0);
  const [maxCompliance, setMaxCompliance] = React.useState(0);
  const [chart_data, setchart_data] = useState({});
  const [iscompliancedata_empty, setiscompliance_empty] = useState(true);

  React.useEffect(() => {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the  day of the month - the day of the week \

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(curr.getDate() + 6)).toUTCString();

    setCurrentStartWeek(formatSpecificDate(firstday));
    setCurrentEndWeek(formatSpecificDate(lastday));
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

  function formatSpecificDate2(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month].join("/");
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

    return [month, day].join(" ");
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

  function addDate(str, i) {
    var tomorrow = new Date(str);
    tomorrow.setDate(tomorrow.getDate() + i);
    return tomorrow;
  }

  React.useEffect(() => {
    db.collection("workouts")
      .where("date", ">=", currentStartWeek)
      .where("date", "<=", currentEndWeek)
      .orderBy("date")
      .get()
      .then((querySnapshot) => {
        let data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        data = data.filter((d) => d.assignedById === userData?.id);
        setWorkouts(data);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [currentStartWeek, currentEndWeek, userData]);

  function arrayMax(arr) {
    return arr.reduce(function (p, v) {
      return p > v ? p : v;
    });
  }
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

  React.useEffect(() => {
    if (workouts.length > 0) {
      let tDate = workouts[0].date;
      let temp = [];
      let count = 0;
      let maxArr = [];
      setiscompliance_empty(true);
      for (let i = 0; i < 7; i++) {
        let t1 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Fully compliant"
        );
        let t2 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Partially compliant"
        );
        let t3 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Non compliant"
        );
        let t4 = workouts.filter(
          (w) => w.date === tDate && w.compliance === "Exceeded"
        );
        temp.push([t1.length, t2.length, t3.length, t4.length]);
        count = t1.length + t2.length + t3.length + t4.length;
        maxArr.push(count);
        tDate = incr_date(tDate);
        if (count > 0) {
          setiscompliance_empty(false);
        }
      }

      setCompliance(temp);

      setComplianceCount(count);
      setMaxCompliance(arrayMax(maxArr));
    } else {
      setCompliance([]);
      setComplianceCount(0);
      setMaxCompliance(0);
    }

    // console.log(compliance, complianceCount, maxCompliance);
  }, [workouts, currentStartWeek, currentEndWeek]);

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
    for (var n = 0; n < 6; n = n + 1) {
      let tDate = new Date(tempDate);
      tempDate = formatSpecificDate(
        new Date(tDate.setDate(tDate.getDate() + 1)).toUTCString()
      );
      let s = formatSpecificDay(tempDate);

      labels.push(s);
    }

    // if (compliance.length !== 0) {
    //   for (let x = 0; x < 4; x = x + 1) {
    //     let day_data = [];
    //     for (let y = 0; y < 7; y = y + 1) {
    //       day_data.push(compliance[y][x]);
    //     }

    //     let d = {
    //       data: day_data,
    //       backgroundColor: colors[x],
    //       categoryPercentage: 1,
    //     };
    //     console.log(day_data);
    //     data.push(d);
    //   }
    // }

    var d1 = [];
    var d2 = [];
    var d3 = [];
    var d4 = [];
    var data = compliance;
    if (compliance.length !== 0) {
      for (let x = 0; x < 7; x = x + 1) {
        d1.push(data[x][0]);
      }
      for (let x = 0; x < 7; x = x + 1) {
        d2.push(data[x][1]);
      }
      for (let x = 0; x < 7; x = x + 1) {
        d3.push(data[x][2]);
      }
      for (let x = 0; x < 7; x = x + 1) {
        d4.push(data[x][3]);
      }
      var data2 = {
        labels: labels,

        datasets: [
          {
            label: "Fully Compliant",
            categoryPercentage: 0.6,
            data: d1.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d1,
            backgroundColor: "#fcd54a",
          },
          {
            label: "Partially Compliant",
            categoryPercentage: 0.6,
            data: d2,
            backgroundColor: "#454545",
          },
          {
            label: "Non Compliant",
            categoryPercentage: 0.6,
            data: d3,
            backgroundColor: "#454545",
          },
          {
            label: "Exceeded",
            categoryPercentage: 0.6,
            data: d4,
            backgroundColor: "red",
          },
        ],
      };

      setchart_data(data2);
    } else {
      setchart_data({});
    }

    // var temp = [
    //   {
    //     data: d1.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d1,
    //     backgroundColor: "red",
    //     categoryPercentage: 1,
    //   },
    //   {
    //     data: d2.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d2,
    //     backgroundColor: "blue",
    //     categoryPercentage: 1,
    //   },
    //   {
    //     data: d3.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d3,
    //     backgroundColor: "green",
    //     categoryPercentage: 1,
    //   },
    //   {
    //     data: d4.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d4,
    //     backgroundColor: "violet",
    //     categoryPercentage: 1,
    //   },
    // ];
    // var data1 = {
    //   labels: labels,

    //   datasets: [
    //     {
    //       data: d1.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d1,
    //       backgroundColor: "red",
    //       categoryPercentage: 1,
    //     },
    //     {
    //       data: d2.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d2,
    //       backgroundColor: "blue",
    //       categoryPercentage: 1,
    //     },
    //     {
    //       data: d3.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d3,
    //       backgroundColor: "green",
    //       categoryPercentage: 1,
    //     },
    //     {
    //       data: d4.length == 0 ? [0, 0, 0, 0, 0, 0, 0] : d4,
    //       backgroundColor: "violet",
    //       categoryPercentage: 1,
    //     },
    //   ],
    // };
  }, [compliance, complianceCount]);

  const options = {
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          // This more specific font property overrides the global property
          fontColor: "red",
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          lineWidth: 0,
          borderWidth: 0,
        },
        ticks: {
          display: !iscompliancedata_empty,
        },

        borderWidth: 10,
      },
      y: {
        stacked: true,
        grid: {
          display: false,
          lineWidth: 0,
          borderWidth: 0,
        },
        ticks: {
          display: !iscompliancedata_empty,
          min: 0,
          stepSize: 1,
        },
      },
    },
  };

  function labels() {
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
        {iscompliancedata_empty && (
          <div
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              transform: "translateX(50%)",
              top: 240,
            }}
          >
            No data available to show
          </div>
        )}
        <div
          className="chart_legend"
          style={{ color: "#808080", fontSize: 20, margin: 10 }}
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
              var first = curr.getDate() - curr.getDay() - 7; // First day is the  day of the month - the day of the week \

              var firstday = new Date(curr.setDate(first)).toUTCString();

              var lastday = new Date(
                curr.setDate(curr.getDate() + 6)
              ).toUTCString();
              setCurrentEndWeek(formatSpecificDate(lastday));
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
          {" "}
          <Bar
            width="350"
            height={height}
            data={chart_data}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}

export default Report_coach;
