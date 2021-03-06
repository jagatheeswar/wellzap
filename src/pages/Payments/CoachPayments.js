import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import WorkoutCard from "../../Components/WorkoutCard/WorkoutCard";
import { selectUserData, selectUserType } from "../../features/userSlice";
import { formatDate } from "../../functions/formatDate";
import { db } from "../../utils/firebase";
import PaymentsScreenHeader from "./PaymentsScreenHeader";
import { PieChart } from "react-minimal-pie-chart";
import moment from "moment";
import { Pie } from "react-chartjs-2";

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

function CoachPayments() {
  const userData = useSelector(selectUserData);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [today, setToday] = useState([]);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

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

  useEffect(() => {
    if (userData) {
      db.collection("payments")
        .where("coach", "==", userData.id)
        .get()
        .then((snap) => {
          var payments_data = [];
          var completed = [];
          var upcoming = [];
          var pending = [];
          var today = [];
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
        });
    }
  }, [userData?.id]);

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
                    style={{ textAlign: "center", cursor: "pointer" }}
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
                    style={{ textAlign: "center", cursor: "pointer" }}
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
                height: "300px",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <div style={{ flex: 0.65 }}>
                {upcoming.length != 0 ||
                pending.length != 0 ||
                today.length != 0 ||
                completed.length != 0 ? (
                  <PieChart
                    data={data}
                    lineWidth={50}
                    labelPosition={75}
                    radius={35}
                    label={() => (
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: 100,
                          width: "20px",
                          height: "20px",
                        }}
                      >
                        <p>5</p>
                      </div>
                    )}
                  />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No Payments
                  </div>
                )}
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

              <div style={{ flex: 0.35 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "orange",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>{today.length} - Due Today</p>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "red",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>{pending.length} - Pending</p>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "#ffe346",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>{upcoming.length} - Due Soon</p>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "#34B334",
                      borderRadius: 100,
                      alignSelf: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  ></div>
                  <p>{completed.length} - Completed</p>
                </div>
              </div>
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
                    style={{ textAlign: "center", cursor: "pointer" }}
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

export default CoachPayments;
