import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import {
  selectUserData,
  selectUserType,
  selectTemperoryId,
} from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import firebase from "firebase";
import PaymentsScreenHeader from "./PaymentsScreenHeader";
import { PieChart } from "react-minimal-pie-chart";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";

import { Pie } from "react-chartjs-2";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import DatePicker from "react-datepicker";

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

function EditPayments() {
  const userData = useSelector(selectUserData);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [today, setToday] = useState([]);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const userType = useSelector(selectUserType);
  const [editable, seteditable] = useState(false);
  const [upcomingId, setUpcomingId] = useState([]);
  const [amount, setAmount] = useState(null);
  const [reload, setreload] = useState(false);
  const userDataCoach = useSelector(selectUserData);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("DD-MM-YYYY")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).add(30, "days").format("DD-MM-YYYY")
  );
  const [frequency, setFrequency] = useState("once in a week");

  const [isLoading, setisLoading] = useState(true);
  const temperoryId = useSelector(selectTemperoryId);

  const [data, setData] = useState([
    { title: "Due Soon", value: 10, color: "red" },
    { title: "Pending", value: 15, color: "#ffe486" },
    { title: "Due Soon", value: 20, color: "red" },
    { title: "Completed", value: 20, color: "#ffe486" },
  ]);

  const [chart_data, setchart_data] = useState({
    labels: ["Due Soon", "Pending", "Due Today", "Completed"],
    datasets: [
      {
        data: [10, 5, 10, 20],
        backgroundColor: ["red", "green", "red", "ffe486"],
      },
    ],
  });
  console.log(temperoryId);
  const ChangePayments = async () => {
    if (temperoryId) {
      if (!amount) {
        alert("Wellzap", "Please enter the amount!");
      } else {
        setisLoading(true);
        console.log(temperoryId, amount, frequency);
        db.collection("athletes")
          .doc(temperoryId)
          .update({
            payments: {
              amount: amount,
              frequency: frequency,
            },
          })
          .then(async (id) => {
            var days;
            var Difference_In_Time;
            var Difference_In_Days;

            if (frequency == "once in a week") {
              days = 7;
            } else if (frequency == "once in 2 weeks") {
              days = 14;
            } else if (frequency == "once in a month") {
              days = 30;
            } else {
              days = 90;
            }
            Difference_In_Time =
              moment(endDate, "DD-MM-YYYY").valueOf() -
              moment(startDate, "DD-MM-YYYY").valueOf();
            Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            for (var i = days; i < Difference_In_Days; i = i + days) {
              var temp_date = new Date(moment(new Date()).add(i, "days"));
              temp_date = new Date(
                temp_date.getFullYear(),
                temp_date.getMonth(),
                temp_date.getDate(),
                17,
                0,

                0,
                0
              );
              const newCityRef = db.collection("payments").doc();

              // const res = await newCityRef.set({
              //   athleteName: athleteData.name,
              //   date: firebase.firestore.Timestamp.fromDate(new Date(temp_date)),
              //   athlete: data.athlete,
              //   coach: userData?.id,
              //   amt: amount,
              //   status: "not paid",
              // });
              //  console.log(userDataCoach, amount, temperoryId);
              const res1 = await newCityRef
                .set({
                  athleteName: "athlete",
                  date: firebase.firestore.Timestamp.fromDate(
                    new Date(temp_date)
                  ),
                  athlete: temperoryId,
                  coach: userDataCoach?.id,
                  amt: amount,
                  status: "not paid",
                })
                .then(() => {
                  console.log("done");
                });

              // var docid = [];
              // const data = await db
              //   .collection("payments")
              //   .where("athlete", "==", temperoryId)
              //   .where("status", "!=", "paid")
              //   .get()
              //   .then((querySnapshot) => {
              //     console.log(1);
              //     querySnapshot.docs.forEach((data) => {
              //       console.log(data.id);
              //       docid.push(data.id);
              //     });
              //   });

              upcomingId?.map((id) => {
                let res = db
                  .collection("payments")
                  .doc(id)
                  .delete()
                  .then((snap) => {
                    console.log(12);
                  });
              });
              setreload(!reload);
              seteditable(false);
            }
          })
          .catch(function (error) {
            console.log("Error getting documents 1: ", error);
            alert("failed the change payments, please provide correct input");
          });
        alert("all the upcoming payments changed successfully");
      }
    }
  };

  useEffect(() => {
    if (temperoryId) {
      db.collection("payments")
        .where("athlete", "==", temperoryId)
        .get()
        .then((snap) => {
          var payments_data = [];
          var completed = [];
          var upcoming = [];
          var pending = [];
          var today = [];
          var DocId = [];

          snap.docs.forEach((doc) => {
            let appObj = { ...doc.data(), ["id"]: doc.id };
            payments_data.push(appObj);
          });
          payments_data.sort((a, b) => {
            return (
              new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000)
            );
          });
          payments_data.forEach((id) => {
            if (id.status == "paid") {
              completed.push(
                <div
                  key={id.id}
                  style={{
                    display: "flex",
                    marginBottom: 15,
                    backgroundColor: "white",
                    paddingRight: 20,
                    paddingLeft: 20,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                      {id.athleteName}
                    </p>
                    <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                      <b>Due on:</b>{" "}
                      {moment(id.date.seconds * 1000).format("ll")}
                    </p>
                  </div>
                  <p style={{ fontSize: 16, color: "black" }}>
                    {"\u20B9"} {id.amt}
                  </p>
                </div>
              );
            } else {
              if (
                moment(
                  moment(new Date()).format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() <=
                  id.date.seconds * 1000 &&
                moment(
                  moment(new Date()).add(1, "days").format("DD-MM-YYYY"),
                  "DD-MM-YYYY"
                ).valueOf() >=
                  id.date.seconds * 1000
              ) {
                DocId.push(id.id);

                today.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: "black" }}>
                      {"\u20B9"} {id.amt}
                    </p>
                  </div>
                );
              } else if (
                id.date.seconds * 1000 <
                moment(new Date()).valueOf()
              ) {
                DocId.push(id.id);

                pending.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: "black" }}>
                      {"\u20B9"} {id.amt}
                    </p>
                    <div
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: 0,
                        top: 0,
                      }}
                      onClick={() => {
                        console.log(1);
                        db.collection("payments")
                          .doc(id.id)
                          .delete()
                          .then(() => {
                            setreload(!reload);
                            alert("deleted");
                          })
                          .catch(() => {
                            alert("failed to delete");
                            setreload(!reload);
                          });
                        // setreload(!reload)
                      }}
                    >
                      <CloseIcon
                        style={{
                          width: 30,
                        }}
                      />
                    </div>
                  </div>
                );
              } else {
                DocId.push(id.id);

                upcoming.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,

                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, color: "black" }}>
                      {"\u20B9"} {id.amt}
                    </p>
                  </div>
                );
              }
            }
          });

          setData([
            { title: "Due Today", value: today.length, color: "orange" },
            { title: "Pending", value: pending.length, color: "red" },
            { title: "Due Soon", value: upcoming.length, color: "#ffe486" },
            { title: "Completed", value: completed.length, color: "#34B334" },
          ]);

          setchart_data({
            labels: ["Due Soon", "Pending", "Due Today", "Completed"],
            datasets: [
              {
                data: [
                  upcoming.length,
                  pending.length,
                  today.length,
                  completed.length,
                ],
                backgroundColor: ["#FF6B6B", "#34B334", "red", "#ffe486"],
              },
            ],
          });

          setPending(pending);
          setUpcoming(upcoming);
          setCompleted(completed);
          setToday(today);
          setUpcomingId(DocId);
          setisLoading(false);
        });
    }
  }, [userData?.id, temperoryId, reload]);

  return (
    <div style={{ minHeight: "99.7vh" }} className="workouts__home">
      <div className="coachDashboard__leftContainer">
        <PaymentsScreenHeader name="Payments" />

        <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
          <div style={{ flex: 0.45, padding: "10px" }}>
            <div style={{ margin: "20px" }}>
              <p>
                <b>Due Today</b>
              </p>
              {today.length == 0 ? (
                <div
                  style={{
                    display: "flex",
                    marginBottom: 15,
                    backgroundColor: "white",
                    paddingRight: 20,
                    paddingLeft: 20,
                    borderRadius: 10,
                  }}
                >
                  <p>
                    <b>No payments today.</b>
                  </p>
                </div>
              ) : (
                today
              )}
              <p>
                <b>Pending</b>
              </p>
              {pending.length == 0 && (
                <div
                  style={{
                    display: "flex",
                    marginBottom: 15,
                    backgroundColor: "white",
                    paddingRight: 20,
                    paddingLeft: 20,
                    borderRadius: 10,
                  }}
                >
                  <p>
                    <b>No Pending payments today.</b>
                  </p>
                </div>
              )}
              {pendingOpen ? null : pending.slice(0, 4)}
              {pending.length > 4 ? (
                pendingOpen ? (
                  pending
                ) : (
                  <div
                    onClick={() => setPendingOpen(true)}
                    style={{ divAlign: "center", cursor: "pointer" }}
                  >
                    {pending.length - 4} more
                  </div>
                )
              ) : null}
              <p>
                <b>Due Soon</b>
              </p>
              {upcoming.length == 0 && (
                <div
                  style={{
                    display: "flex",
                    marginBottom: 15,
                    backgroundColor: "white",
                    paddingRight: 20,
                    paddingLeft: 20,
                    borderRadius: 10,
                  }}
                >
                  <p>
                    <b>No upcoming payments.</b>
                  </p>
                </div>
              )}
              {upcomingOpen ? null : upcoming.slice(0, 4)}
              {upcoming.length > 4 ? (
                upcomingOpen ? (
                  upcoming
                ) : (
                  <div
                    onClick={() => setUpcomingOpen(true)}
                    style={{ divAlign: "center", cursor: "pointer" }}
                  >
                    {upcoming.length - 4} more
                  </div>
                )
              ) : null}
            </div>
          </div>
          <div style={{ flex: 0.45, padding: "10px", marginLeft: 20 }}>
            <div
              style={{
                margin: "20px",
                backgroundColor: "white",
                width: "100%",

                borderRadius: 10,

                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 20,
              }}
            >
              <div style={{}}>
                <div
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    marginTop: 20,
                    paddingBottom: 20,
                    marginHorizontal: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 20,
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    Payment
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 20,
                      color: "black",
                    }}
                  >
                    Amount
                  </div>
                  <input
                    disabled={!editable}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 5,
                      paddingLeft: 20,
                      borderWidth: 0.5,
                      borderColor: "black",
                      padding: "5px 10px",
                      fontSize: 17,
                    }}
                    value={amount}
                    placeholder="Enter Amount"
                    onChange={(div) => {
                      setAmount(div.target.value);
                    }}
                    keyboardType={"numeric"}
                  />

                  <div
                    style={{
                      fontSize: 17,
                      marginBottom: 20,
                      marginTop: 20,
                      color: "black",
                    }}
                  >
                    Frequency of Payment
                  </div>

                  <div style={{}}>
                    <Dropdown
                      disabled={!editable}
                      options={[
                        { label: "Once in a week", value: "once in a week" },
                        { label: "Once in 2 weeks", value: "once in 2 weeks" },
                        { label: "Once in a month", value: "once in a month" },
                        { label: "Once in 3 month", value: "once in 3 month" },
                      ]}
                      placeholder="Select frequency of payment"
                      onChange={(item) => {
                        setFrequency(item.value);
                      }}
                    />
                  </div>
                  {/* {Platform.OS === "ios" ? (
          <RNPickerSelect
            value={frequency}
            style={{ paddingVertical: 5 }}
            onValueChange={(itemValue, itemIndex) => {
              setFrequency(itemValue);
            }}
            items={[
              { label: "Once in a week", value: "Once in a week" },
              { label: "Once in 2 weeks", value: "Once in 2 weeks" },
              { label: "Once in a month", value: "Once in a month" },
              { label: "Once in 3 month", value: "Once in 3 month" },
            ]}
          />
        ) : (
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue, itemIndex) => {
              setFrequency(itemValue);
            }}
          >
            <Picker.Item label="Once in a week" value="once in a week" />
            <Picker.Item label="Once in 2 weeks" value="once in 2 weeks" />
            <Picker.Item label="Once in a month" value="once in a month" />
            <Picker.Item label="Once in 3 months" value="once in 3 months" />
          </Picker>
        )} */}
                </div>
                {/* <div style={{ width: 230 }}>
                <Pie
                  data={chart_data}
                  options={{
                    width: "100",
                    height: "100",

                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div> */}
              </div>
              <div
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "40%",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      color: "black",
                    }}
                  >
                    Start Date
                  </div>
                  <DatePicker
                    style={{
                      padding: 20,
                    }}
                    disabled={!editable}
                    selected={new Date(moment(startDate, "DD-MM-YYYY"))}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>

                <div
                  style={{
                    width: "40%",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,

                      color: "black",
                    }}
                  >
                    End Date
                  </div>
                  <DatePicker
                    disabled={!editable}
                    selected={new Date(moment(endDate, "DD-MM-YYYY"))}
                    minDate={new Date(moment(startDate, "DD-MM-YYYY"))}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
              </div>
              {userType == "coach" &&
                (editable ? (
                  <div
                    onClick={() => ChangePayments()}
                    style={{
                      backgroundColor: "#fcd54a",
                      padding: 10,
                      width: "200px",
                      display: "flex",
                      marginRight: "auto",
                      marginLeft: "auto",
                      borderRadius: 25,
                      alignSelf: "center",
                      marginTop: 20,
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Save upcoming Payments
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => seteditable(true)}
                    style={{
                      backgroundColor: "#fcd54a",
                      padding: 10,
                      width: "200px",
                      display: "flex",
                      marginRight: "auto",
                      marginLeft: "auto",
                      borderRadius: 25,
                      alignSelf: "center",
                      marginTop: 20,
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Edit Payments
                    </div>
                  </div>
                ))}
            </div>
            <div style={{ margin: 20, width: "100%" }}>
              <p>
                <b>Completed</b>
              </p>
              {completed.length == 0 && (
                <div
                  style={{
                    display: "flex",
                    marginBottom: 15,
                    backgroundColor: "white",
                    paddingRight: 20,
                    paddingLeft: 20,
                    borderRadius: 10,
                  }}
                >
                  <p>
                    <b>No completed payments.</b>
                  </p>
                </div>
              )}
              {completedOpen ? null : completed.slice(0, 4)}
              {completed.length > 4 ? (
                completedOpen ? (
                  completed
                ) : (
                  <div
                    onClick={() => setCompletedOpen(true)}
                    style={{ divAlign: "center", cursor: "pointer" }}
                  >
                    {completed.length - 4} more
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPayments;
