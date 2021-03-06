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

function AthletePayments() {
  const userData = useSelector(selectUserData);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [today, setToday] = useState([]);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const [data, setData] = useState([
    { title: "Due Soon", value: 10, color: "#FFE66D" },
    { title: "Pending", value: 15, color: "#00B1C0" },
    { title: "Due Soon", value: 20, color: "#FF6B6B" },
    { title: "Completed", value: 20, color: "red" },
  ]);

  useEffect(() => {
    if (userData) {
      db.collection("payments")
        .where("athlete", "==", userData.id)
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
          console.log(payments_data);
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
                      padding: 10,
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
                    <div style={{ margin: 0, padding: 0 }}>
                      <p
                        style={{
                          fontSize: 16,
                          color: "black",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9"} {id.amt}
                      </p>
                      <div
                        style={{
                          backgroundColor: "#ffe486",
                          padding: 5,
                          cursor: "pointer",
                          marginTop: 2,
                          borderRadius: 5,
                        }}
                      >
                        Pay Now
                      </div>
                    </div>
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
                      padding: 10,
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
                    <div style={{ margin: 0, padding: 0 }}>
                      <p
                        style={{
                          fontSize: 16,
                          color: "black",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9"} {id.amt}
                      </p>
                      <div
                        style={{
                          backgroundColor: "#ffe486",
                          padding: 5,
                          cursor: "pointer",
                          marginTop: 2,
                          borderRadius: 5,
                        }}
                      >
                        Pay Now
                      </div>
                    </div>
                  </div>
                );
              } else {
                upcoming.push(
                  <div
                    key={id.id}
                    style={{
                      display: "flex",
                      padding: 10,
                      marginBottom: 15,
                      backgroundColor: "white",
                      paddingRight: 20,
                      paddingLeft: 20,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {console.log("ss", id)}
                    <div>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        {id.athleteName}
                      </p>
                      <p style={{ fontSize: 16, color: "black", margin: 0 }}>
                        <b>Due on:</b>{" "}
                        {moment(id.date.seconds * 1000).format("ll")}
                      </p>
                    </div>
                    <div style={{ margin: 0, padding: 0 }}>
                      <p
                        style={{
                          fontSize: 16,
                          color: "black",
                          margin: 0,
                          padding: 0,
                          textAlign: "center",
                        }}
                      >
                        {"\u20B9"} {id.amt}
                      </p>
                      <div
                        style={{
                          backgroundColor: "#ffe486",
                          padding: 5,
                          cursor: "pointer",
                          marginTop: 2,
                          borderRadius: 5,
                        }}
                      >
                        Pay Now
                      </div>
                    </div>
                  </div>
                );
              }
            }
          });

          setData([
            { title: "Due Today", value: today.length, color: "red" },
            { title: "Pending", value: pending.length, color: "green" },
            { title: "Due Soon", value: upcoming.length, color: "#FF6B6B" },
            { title: "Completed", value: completed.length, color: "#ffe486" },
          ]);

          setPending(pending);
          setUpcoming(upcoming);
          console.log(upcoming);
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
                    <b>No pending payments.</b>
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
            </div>
          </div>
          <div style={{ flex: 0.45, padding: "10px", marginLeft: 20 }}>
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
            <div style={{ margin: 20, width: "100%" }}>
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
        </div>
      </div>
    </div>
  );
}

export default AthletePayments;
