import React, { useEffect, useState } from "react";
import Report_coach from "../Reports/Report_coach";
import { PieChart } from "react-minimal-pie-chart";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUserData } from "../../features/userSlice";
import { db } from "../../utils/firebase";
import CoachPayments from "../Payments/CoachPayments";
function CoachHomeReports() {
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
            { title: "Due Today", value: today.length, color: "#FFE66D" },
            { title: "Pending", value: pending.length, color: "#00B1C0" },
            { title: "Due Soon", value: upcoming.length, color: "#FF6B6B" },
            { title: "Completed", value: completed.length, color: "red" },
          ]);

          setPending(pending);
          setUpcoming(upcoming);
          setCompleted(completed);
          setToday(today);
        });
    }
  }, [userData?.id]);

  return (
    <div className="home__reports">
      <h1>Reports</h1>
      <div className="home__reportsMainContainer">
        <div className="home__reportsLeftContainer">
          <h1>Compliance</h1>
          <div style={{ width: "100%" }}>
            <Report_coach height={150} />
          </div>
        </div>
        <div className="home__reportsRightContainer">
          <h1>Payments</h1>
          <div style={{ width: "100%", marginTop: 20 }}>
            <div
              style={{
                backgroundColor: "white",
                justifyContent: "space-between",
                alignItems: "center",
                height: "330px",
                borderRadius: 10,
                display: "flex",
                width: 400,
              }}
            >
              <div>
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
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: "#FFE66D",
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
                      backgroundColor: "#00B1C0",
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
                      backgroundColor: "#FF6B6B",
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
                      backgroundColor: "red",
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachHomeReports;
