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
import id from "date-fns/locale/id";

import { TapAndPlay } from "@material-ui/icons";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DateRange from "./DateRange";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const options = {
  scaleShowVerticalLines: false,
  maintainAspectRatio: false,
  labels: {
    fontColor: "red",
    display: "false",
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
        display: false,
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

const Graph3_ = (props) => {
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
  const [currentStartWeek, setCurrentStartWeek] = useState(null);
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
  var today = new Date();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);

  const [mindate, setmindate] = useState(new Date());
  const [maxdate, setmaxdate] = useState(null);


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

  console.log(max_date, min_date);
  const defaultValue = {
    from: min_date,
    to: max_date,
  };
  const [selectedDayRange, setSelectedDayRange] = useState(defaultValue);

  var Id = props.Id && props.Id;

  useEffect(() => {
    if (userType) {
      db.collection("athletes")
        .doc(Id ? Id : "Zonwno1E5oyZ3sYImBjY")
        .get()
        .then(function (snap) {
          setAthleteDetails({
            id: Id,
            data: snap.data(),
          });
          console.log(snap.data());
          if (snap.data().metrics) {
            let key = Object.keys(snap.data().metrics);
            let dates = [];
            key.forEach((item) => {
              dates.push(new Date(moment(item)));
            });
            if (dates.length == key.length) {
              var minimumDate = new Date(Math.min.apply(null, dates));
              if (minimumDate) {
                setmindate(minimumDate);
              } else {
                setmindate(new Date());
              }
            }
          }
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } else {
      setAthleteDetails(userData);
    }
  }, [userData, temperoryId]);

  useEffect(() => {
    if (mindate) {
      let a = moment(new Date());
      let b = moment(mindate);
      let diff = a.diff(b, "days");
      setendDate(new Date())

      if (diff > 32) {
        setCurrentStartWeek(
          moment(new Date()).subtract(30, "days").utc().format("DD-MM-YYYY")
        );
       
        setstartDate( new Date().setDate(new Date().getDate() - 30))
      } else {
        setCurrentStartWeek(
          moment(new Date()).subtract(diff, "days").utc().format("DD-MM-YYYY")
        );
        setstartDate( new Date().setDate(new Date().getDate() - diff))
      }
    }
  }, [mindate]);

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
  function formatSpecificDate(d) {
    var d = new Date(d),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      console.log("sd", startDate, endDate);
      let date = formatSpecificDate(endDate);
      setCurrentEndWeek(date.split("-").reverse().join("-"));
      let date1 = formatSpecificDate(startDate);
      setCurrentStartWeek(date1.split("-").reverse().join("-"));

      console.log(currentStartWeek, currentEndWeek);
    }
  }, [startDate, endDate]);

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

      let a = moment(new Date());
      let b = moment(mindate);
      var total_diff = a.diff(b, "days");

      console.log("Inside weight graph useEffect");
      console.log("Second one");

      console.log("Tthird one");
      console.log(currentStartWeek, currentEndWeek);

      if (athleteDetails?.data?.metrics) {
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
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].weight
                  ) {
                    val = athleteDetails?.data.metrics[tDate].weight;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                weight = val;
              }
              if (athleteDetails?.data?.metrics[tempDate].fat) {
                fat = athleteDetails?.data?.metrics[tempDate].fat;
              } else {
                let val = 0;
                let tDate = decr_date(tempDate);
                let c = 0;
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].fat
                  ) {
                    val = athleteDetails?.data.metrics[tDate].fat;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
                  tDate = decr_date(tDate);
                }
                fat = val;
              }
              if (athleteDetails?.data?.metrics[tempDate].muscle) {
                muscle = athleteDetails?.data?.metrics[tempDate].muscle;
              } else {
                let val = 0;
                let c = 0;
                let tDate = decr_date(tempDate);
                while (c < total_diff) {
                  if (
                    athleteDetails?.data?.metrics[tDate] &&
                    athleteDetails?.data.metrics[tDate].muscle
                  ) {
                    val = athleteDetails?.data.metrics[tDate].muscle;
                    if (val) {
                      break;
                    }
                  }
                  c = c + 1;
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
              let a1 = 0;
              let a2 = 0;
              let a3 = 0;

              while (a1 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate1] &&
                  athleteDetails?.data.metrics[tDate1].weight
                ) {
                  val1 = athleteDetails?.data.metrics[tDate1].weight;
                  if (val1) {
                    break;
                  }
                }

                a1 = a1 + 1;
                tDate1 = decr_date(tDate1);
              }
              while (a2 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate2] &&
                  athleteDetails?.data.metrics[tDate2].fat
                ) {
                  val2 = athleteDetails?.data.metrics[tDate2].fat;
                  if (val2) {
                    break;
                  }
                }

                a2 = a2 + 1;
                tDate2 = decr_date(tDate2);
              }
              while (a3 < total_diff) {
                if (
                  athleteDetails?.data.metrics[tDate3] &&
                  athleteDetails?.data.metrics[tDate3].muscle
                ) {
                  val3 = athleteDetails?.data.metrics[tDate3].muscle;
                  if (val3) {
                    break;
                  }
                }
                a3 = a3 + 1;
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
  }, [athleteDetails, currentStartWeek]);

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

    if (graph3Options == "weight") {
      var data1 = {
        labels: labels,
        datasets: [{ label: "1", data: graph3Data1, borderColor: "#d3d3d3" }],
      };
      setchart_data2(data1);
    } else if (graph3Options == "fat") {
      var data1 = {
        labels: labels,
        datasets: [{ label: "1", data: graph3Data2, borderColor: "#fcd54a" }],
      };
      setchart_data2(data1);
    } else if (graph3Options == "muscle") {
      var data1 = {
        labels: labels,
        datasets: [{ label: "1", data: graph3Data3, borderColor: "black" }],
      };
      setchart_data2(data1);
    } else {
      var data1 = {
        labels: labels,
        datasets: [
          { label: "1", data: graph3Data1, borderColor: "#d3d3d3" },
          {
            label: "2",
            data: graph3Data2,
            borderColor: "#fcd54a",
          },
          {
            label: "3",
            data: graph3Data3,
            borderColor: "black",
          },
        ],
      };

      setchart_data2(data1);
    }
  }, [graph3Options, graph3Data1, graph3Data2, graph3Data3]);

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

  function labels() {
    let datasets = chart_data2.datasets;
    let data = [
      {
        label: "Fat",
        color: "#fcd54a",
      },
      {
        label: "Muscle",
        color: "black",
      },
      {
        label: "Weight",
        color: "#d3d3d3",
      },
    ];
    if (data) {
      let stack_label = Object.keys(data).map((item) => {
        return (
          <li
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              marginRight: 20,
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
                marginRight: 5,
                backgroundColor: data[item]["color"],
              }}
            ></div>
            {data[item]["label"]}
          </li>
        );
      });
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ul
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginBlockStart: 0,
            }}
          >
            {stack_label}
          </ul>
        </div>
      );
    }
  }

  return (
    <div className="chart_container">
      <div className="chart_">
        {!athleteDetails?.data?.metrics && (
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
        <div className="chart_legend">
          Weekly Report
          <div className="dropdown_" style={{ padding: 15 }}>
            <Dropdown_
              change_graph={changeGraph_option}
              options={dropdown_options}
            />
          </div>
        </div>
        {/* <DatePicker
          value={selectedDayRange}
          onChange={setSelectedDayRange}
          inputPlaceholder="Select a date" // placeholder
          // format value
          inputClassName="date_range_input" // custom class
          shouldHighlightWeekends
          minimumDate={min_date}
          maximumDate={max_date}
        /> */}
        <div style={{textAlign:'center', marginTop: 15, display:'flex',justifyContent:'center',alignItems:'center' }}>
         
          <DatePicker
      selected={startDate}
      onChange={(date) => setstartDate(date)}
      minDate={mindate}
    
    />
    <span>and</span>
    <DatePicker
      selected={endDate}
      maxDate={new Date()}
      onChange={(date) => setendDate(date)}
      
    />
        </div>
        <div className="chart_header"></div>
        {graph3Options !== "all" ? "" : labels()}

        <div className="chart_bar" style={{ marginTop: 20 }}>
          <Line width="350" height="200" data={chart_data2} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Graph3_;

const dropdown_options = [
  {
    key: "1",
    text: "all",
    value: "all",
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
  {
    key: "4",
    text: "weight",
    value: "weight",
  },
];
